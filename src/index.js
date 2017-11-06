import React from 'react';
import ReactDOM from 'react-dom';
import {FormGroup, FormControl, InputGroup, Glyphicon} from 'react-bootstrap';

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			query: '',
			tripNum: '',
			departures: '',
			arrivals: '',
			departTime: '',
			arrivalTime: '',
			walking: '',
			walkingDepart: '',
			walkingArrival: ''
		}
	}
//https://api.triplinx.cityway.ca/api/journeyplanner/opt/PlanTrips/json?user_key=c37553e3fdf144a6b017cb39f27e7ebd&DepartureType=COORDINATES&DepartureLatitude=43.5236235&DepartureLongitude=-79.8693889&ArrivalType=COORDINATES&ArrivalLatitude=43.645225&ArrivalLongitude=-79.3827583&Date=2017-12-06_11-30&DateType=DEPARTURE&Algorithm=FASTEST&TripModes=PT&AllowedOperatorIds=1
search () {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", this.state.query, false);
	xhr.send();
	
	var json = xhr.response;
	json = JSON.parse(json);
	var tripNum = json.Data[0].response.trips.Trip.length;
	this.setState({tripNum: tripNum})
	var departures = [];
	var arrivals = [];
	var departuresTime = [];
	var arrivalsTime = [];
	var walking = [];
	var walkingArrivalTime = [];
	var walkingDepartureTime = [];

	
for(var x = 0; x < json.Data[0].response.trips.Trip[0].sections.Section.length; x++){


		if(json.Data[0].response.trips.Trip[0].sections.Section[x].PTRide != null){
			var routes = json.Data[0].response.trips.Trip[0].sections.Section[x].PTRide.steps.Step;
//			console.log(json.Data[0].response.trips.Trip[0].sections.Section[x]);

			departuresTime.push(routes[0].Departure.Time);
			arrivalsTime.push(routes[routes.length -1].Arrival.Time);
			departuresTime.push(" | ");
			arrivalsTime.push(" | ");
			
			
			this.setState({departTime: departuresTime});
			this.setState({arrivalTime: arrivalsTime});

			routes.map((data) => {
				departures.push(data.Departure.StopPlace.Name);
				arrivals.push(data.Arrival.StopPlace.Name)
				departures.push(" | ");
				arrivals.push(" | ")
			}) 
			departures.push(" END OF LEG |");
			arrivals.push(" END OF LEG |");

		this.setState({departures: departures});
		this.setState({arrivals: arrivals});

		}else {
			walking.push(json.Data[0].response.trips.Trip[0].sections.Section[x].Leg.TransportMode);
			walkingArrivalTime.push(json.Data[0].response.trips.Trip[0].sections.Section[x].Leg.Arrival.Time);
			walkingDepartureTime.push(json.Data[0].response.trips.Trip[0].sections.Section[x].Leg.Departure.Time);

			walking.push(" | ");
			walkingArrivalTime.push(" | ");
			walkingDepartureTime.push(" | ");

			this.setState({walking: walking})
			this.setState({walkingArrival: walkingArrivalTime})
			this.setState({walkingDepart: walkingDepartureTime})


		}
	}
}

	render() {
		return(
			<div className="App">
				<div className="App-title">Search for Metrolinx Information</div>
				<FormGroup>
					<InputGroup>	
						<FormControl 
							type="text"
							placeholder="Enter Triplinx URL"
							value={this.state.query}
							onChange={event => {this.setState({query:event.target.value})}}
							onKeyPress={event => {
								if(event.key ==='Enter') {
									this.search()
								}
							}}
						/>
						<InputGroup.Addon onClick={() => this.search()}>
							<Glyphicon glyph="search"></Glyphicon>
						</InputGroup.Addon>
					</InputGroup>
				</FormGroup>
				<div>Number of Trips: {this.state.tripNum}</div>
				<div>Departures: {this.state.departures}</div>
				<div>Arrivals: {this.state.arrivals}</div>
				<div>Departure Time: {this.state.departTime}</div>
				<div>Arrivals Time: {this.state.arrivalTime}</div>
				<div>Walking Legs: {this.state.walking} </div>
				<div>Walking Arrival Time: {this.state.walkingArrival} </div>
				<div>Walking Departure Time: {this.state.walkingDepart} </div>
			</div>	
		)
	}
}


ReactDOM.render(
	<App />, document.getElementById('root')
);
