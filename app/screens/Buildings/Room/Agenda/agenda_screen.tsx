import React, { useState, useEffect } from "react";
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Agenda, AgendaSchedule } from 'react-native-calendars';
import { getBookings } from '../../../../services/freerooms_api/endpoints';

const ONEHOURLENGTH = 60;
const MILLIS = 3600000;

async function seeBookings(room) {
  // Initialise items as empty arrays for all dates in the year
  const allDates = getDatesForYear(new Date().getFullYear());
  const items: AgendaSchedule = Object.fromEntries(allDates.map(date => [date, []]));

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
  for (let key in bookingResponse["bookings"]) {
    const booking = bookingResponse["bookings"][key]
    const date_time = booking["end"].split('T');

    // calculate time between
    const start_time:Date = new Date(booking["start"]);
    const end_time:Date = new Date(booking["end"]);
    const date = date_time[0];
    const time_diff = (end_time - start_time) / MILLIS;

    if (!(date in items)) {
      items[date] = [];
    }
    items[date].push({
      name: booking["name"],
      height: time_diff * ONEHOURLENGTH,
      day: date,
      time: `${start_time.getHours()}:${String(start_time.getMinutes()).padStart(2, '0')}` + " - " + `${end_time.getHours()}:${String(end_time.getMinutes()).padStart(2, '0')}`,
      type: booking["bookingType"]
    })
  }
  return items;
}

function getDatesForYear(year: number): string[] {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const dateList: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    dateList.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
}

export default function AgendaScreen({ roomId }) {
  const [items, setItems] = useState({});
  const date = new Date();

  const renderItem = (reservation) => {
    const fontSize = 14;
    const color = 'white';
    let backgroundcolour = '#EF6C00';
    switch (reservation.type) {
      case "INTERNAL":
        backgroundcolour = '#BDBF00'
        break;
      case "MISC":
        backgroundcolour = '#FF8353'
        break;
    }
  
    return (
      <TouchableOpacity style={[styles.item, {height: reservation.height, backgroundColor: backgroundcolour}]} onPress={() => pressed(reservation.day)}>
        <Text style={{fontSize, color}}>{reservation.name}</Text>
        <Text style={{fontSize, color}}>{reservation.time}</Text>
  
      </TouchableOpacity>
    );
  }
  
  const pressed = (id: string) => {
    // maybe a page of information on the booking if needed.
    console.log("id has been pressed");
  }
  
  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate} />
    );
  };

  useEffect(() => {
    const loadItems = async () => {
      const bookings = await seeBookings(roomId);
      setItems(bookings);
    }
    loadItems();

  }, [])
  return (
    <Agenda
      items={items}
      loadItemsForMonth={(month) => console.log(month)}
      selected={date.toString()}
      renderItem={(item) => { return (renderItem(item)) }}
      showClosingKnob={true}
      renderEmptyDate={renderEmptyDate}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: ONEHOURLENGTH,
    borderBottomColor: '#a0b1bf',
    marginRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});