import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Agenda, AgendaEntry, AgendaSchedule, DateData} from 'react-native-calendars';
import { getBookings } from '../../../../services/freerooms_api/endpoints';
interface State {
  items?: AgendaSchedule;
}

async function seeBookings(room) {
  const items = {};
  console.log("check");
  console.log(room)
  let bookingResponse = {};
  try {
    bookingResponse = await getBookings(room)
  } catch (error) {
    console.error(error);
    return items;
  }
  
  // need to put an error if bad name
  // items might have no data if the room is has no timetable 
  // eg K-G26-G03 
  console.log(bookingResponse);
  for (let key in bookingResponse["bookings"]) {
    console.log(bookingResponse["bookings"][key]);

    const booking = bookingResponse["bookings"][key]
    const date = booking["end"].split('T')[0];
    if (!items[date]) {
      items[date] = [];
    }
    items[date].push({
      name: booking["name"],
      height: 60,
      day: date,
    })
    // for (let day in bookingResponse["bookings"][key]) {
    //   for (let no in bookingResponse["bookings"][key][day]) {
    //     const item = bookingResponse["bookings"][key][day][no];
    //     const date = item["end"].split('T')[0];
    //     if (!items[date]) {
    //       items[date] = [];
    //     }
    //     items[date].push({
    //       name: item["courseCode"],
    //       height: 60,
    //       day: date,
    //     })
    //   }
    // }
  }
  // put in day

  return items;
}

export default class AgendaScreen extends Component<State> {
  state: State = {
    items: undefined,
  };
  

  render() {
    const date = new Date();
    return (
      <Agenda
        reservationsKeyExtractor={item => `${item.reservation?.day}`}
        items={this.state.items}
        loadItemsForMonth={this.loadItems}
        selected={date.toString()}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showClosingKnob={true}
      />
    );
  }

  loadItems = async (day: DateData) => {
    const items = this.state.items || {};
    if (Object.keys(items).length !== 0) {
      return;
    }

    // this.props from room.tsx not my fault this is class based for some reason.
    const bookings = await seeBookings(this.props.props);
    console.log(bookings);
    // timeout if there is an error
    setTimeout(() => {

      const newItems: AgendaSchedule = {};
      Object.keys(bookings).forEach(key => {
        newItems[key] = bookings[key];
      });
      console.log(newItems);
      this.setState({
        items: newItems,
      });
      
    }, 1000);
  };

  updateItem = (id: string) => {
    const newItems: AgendaSchedule = {...this.state.items};
    if (this.state.items) {
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.updateAgendaEntry(key, id);
      });
      this.setState({
        items: newItems,
      });
    }
  };
  updateAgendaEntry = (date: string, id: string) => {
    let agendaEntryToUpdate: AgendaEntry[] = Object.assign([], this.state.items?.[date]);
    let index = agendaEntryToUpdate.findIndex(a => a.day === id);

    agendaEntryToUpdate[index] = Object.assign(
      {},
      {
        ...agendaEntryToUpdate[index],
        name: 'Has changed !',
      }
    );
    return agendaEntryToUpdate;
  };
  renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';

    return (
      <TouchableOpacity style={[styles.item, {height: reservation.height}]} onPress={() => this.updateItem(reservation.day)}>
        <Text style={{fontSize, color}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  timeToString(time: number) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});