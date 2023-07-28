import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Agenda, AgendaEntry, AgendaSchedule, DateData} from 'react-native-calendars';
import { getBookings } from '../../../../services/freerooms_api/endpoints';
import { Book_Dictionary } from '../../../../services/freerooms_api/api_types';

interface State {
  items?: AgendaSchedule;
}

async function seeBookings() {
  const bookingResponse = await getBookings("K-J17-G01");
  let items = {};
  const testData = bookingResponse[1]["Mon"];
  
  for (let i = 0; i < testData.length; i++) {
    const date = testData[i]["end"].split('T')[0];
    if (!items[date]) {
      items[date] = [];
    }
    items[date].push({
      name: testData[i]["courseCode"],
      height: 60,
      day: date + i,
    })
  }
  return items;
}

export default class AgendaScreen extends Component<State> {
  state: State = {
    items: undefined,
  };
  

  render() {
    return (
      <Agenda
        reservationsKeyExtractor={item => `${item.reservation?.day}`}
        items={this.state.items}
        loadItemsForMonth={this.loadItems}
        selected={'2023-05-29'}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showClosingKnob={true}
      />
    );
  }

  loadItems = (day: DateData) => {
    const items = this.state.items || {};
    
    setTimeout(() => {
      const bookings = seeBookings();
      const items = {"2023-05-29": [{"day": "2023-05-290", "height": 30, "name": "COMP1911"}, {"day": "2023-05-291", "height": 60, "name": "COMP2041"}, {"day": "2023-05-292", "height": 60, "name": "COMP6452"}, {"day": "2023-05-293", "height": 60, "name": "COMP6452"}, {"day": "2023-05-294", "height": 60, "name": "COMP9044"}]};

      // for (let i = -15; i < 85; i++) {
        
      //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      //   const strTime = this.timeToString(time);

      //   if (!items[strTime]) {
      //     items[strTime] = [];

      //     const numItems = 3;
      //     for (let j = 0; j < numItems; j++) {
      //       items[strTime].push({
      //         name: 'Item for ' + '#' + j,
      //         height: Math.max(50, Math.floor(Math.random() * 150)),
      //         day: strTime + j,
      //       });
      //     }
      //   }
      // }
      console.log(bookings);

      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
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