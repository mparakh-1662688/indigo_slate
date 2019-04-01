"use strict";
(function() {

    const baseUrl = "https://crud-api.azurewebsites.net";

    // help make a shortcut for referencing different parts of the web page
    // My assumptions here for the buttons are as follows :- 
    // Create Event button (this is the button on the top of the screen)  - "create-event-main"
    // List Event button - "list-event"
    // Delete Event button - "delete-event"
    // Modify Event button - "modify-event"
    // Event Name textbox - "event-name"
    // Duration textbox - "duration"
    // Start Date/Time textbox - "mm-dd-yyyy"
    // Brief Description textbox - "description"
    // Create Event button (this is the button to confirm events after text fields are 
    // filled appropriately) - "create-event-sub"
    function $(id) {
      return document.getElementById(id);
    }

    // this function help to get designed innitially before the user interacts with the page
    window.onload = function() {
      setup();
      $("create-event-main").onclick = createMain;
      $("list-event").onclick = listEvent;
      $("delete-event").onclick = deleteEvent;
      $("modify-event").onclick = modifyEvent;
      $("event-name").onclick = eventName;
      $("duration").onclick = duration;
      $("description").onclick = description;
      $("mm-dd-yyyy").onclick = dateHandle;
      $("create-event-sub").onclick = createSub;
    };

    // This function will help poluate the site with the current schedules given by 
    // the CRUD api
    function setup() {
        let apiKey = "1f34d8c9-b34c-47f6-b661-94546cbc6f9c";
        let xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + "/api/read/:rowKey", true);
        xhr.setRequestHeader("X-API-Key", apiKey);

        xhr.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                let json = JSON.parse(this.responseText);
                temp(json);
                //console.log(json.Response.data.inventoryItem.itemName); //Gjallarhorn
            }
        }

        xhr.send();
    }

    /*
    The code in the first for loop is to fill in and make a new text box with all the
    details corresponding to the particular day.
    The 2nd for loop would handle the population of each event provided by the API 
    -- NOTE: here we do not check for any form of input inconsistencies (we believe
    the schedule provided by the API does not overlap in any way). We will check 
    for overlaps when we create an event. 
    */
    function temp (responseText) {
        for (int i = 0; i < responseText.length; i++) {
            let dateFull = responseText[i].date;
            let date = dateFull.split("T");
            date = date[0];
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("YYYY-MM-DD");
            LocalDate localDate = LocalDate.parse(date, formatter);
            let values = date.split("-");
            let dateString = localDate.getDayOfMonth() + " " + localDate.getMonthName() + " " + 
                            values[2] + " " + values[0];
            let div = document.createElement("div");
            div.className = "calendar__day";
            document.getElementByClassName("event")[0].appendChild(div);
            div.className = "title";
            let current = document.getElementByClassName("calendar__day")[i].appendChild(div);
            current.innerHTML = dateString;
            // traverses through all of the events scheduled that day
            for (int j = 0; j < responseText[i].events.length; j++) {
                // Will create div tags for all of the different values i.e id, name, dateTime, 
                // duration, brief
            }
        }
    }




/*
The logic while adding an event and making sure that there is no overlapping in that event
The problem in hand:- A user creates an event that starts at a particular time and end at a 
particular time, on a given day. We need to make sure that this event created by them does 
not overlap with the current events already scheduled for that day. 

Solution:- We take all the events scheduled for that day and the new event added by the user
and make event objects that have a start time and an end time. Next, we sort the events by 
finish time and use a greedy algorithm (Interval Scheduling) to check whether all the events
for that day can be scheduled without any conflicts. If a conflict is found we will not let the user add
that particular event.  

*/

    class Event implements Comparable<Event> {
        constructor(startTime, finishTime) {
            this.startTime = startTime;
            this.finishTime = finishTime;
        }
        compareTo(Event event) {
            return this.finishTime - event.finish; 
        }
    }

    let error;
    // If "error" become true, we know that the new event we are trying to add
    // to that particular day is incompatible and an error should be thrown so 
    // that the user cannot add the following event
    function eventManage(Event[] event, boolean error) {
        // Here we will sort the events by finish time in ascending order
        Array.sort(event);
        List <Event> eventSelected = new ArrayList<Event>();
        eventSelected.add(event[0]);
        Event lastEventAdded = event[0];
        for (let i = 1; i < event.length; i++) {
            if (event[i].start >= lastEventAdded) {
                eventSelected.add(event[i]);
            } else {
                error = true;
            }
        }
    }

    // This function will make the help create an event in our schedule for the current day
    function createSub() {
        // Here we will first grab an the event data provide by the api and make Event objects
        // Then we will make an array of such objects
        Event[] event = [event1, event2,...];
        error = false;
        eventManage(event, error);
        if (error) {
            // then we will add this to our schedule.
        }

    }









