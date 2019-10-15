import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
} from 'react-native';
import ReactDOM from 'react-dom';

const styles = StyleSheet.create({
  Wrapper: {
    backgroundColor: '#22447b',
  },

  Container: {
    maxWidth: '40%',
    minWidth: '40%',
    maxHeight: '100%',
    marginTop: '15%',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: '15px',
    alignSelf: 'center',
  },

  User: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 0,
    margin: 15,
  },

  ThumbStyle: {
    borderRadius: '50%',
    width: 65,
    height: 65,
  },

  UserInfo: {
    flex: 1,
    flexDirection: 'column',
    margin: 12,
    padding: 5
  },

  Banner: {
    fontSize: 48,
    fontWeight: 'bold',
  },

  ProfileTop: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 30,
  },

  ProfPic: {
    borderRadius: '3%',
    borderWidth: 10,
    borderColor: 'black',
    height: 200,
    width: 200,
  },

  ProfileTopTextContainer: {
    flexDirection: 'column',
    margin: 20,
    justifyContent: 'center',
  },

  ProfileTopText: {
    fontSize: 20,
  }
})

function DateStrip(date) {
  const year = date.slice(0,4);
  const month = date.slice(5,7);
  const day = date.slice(8,10);

  var numToMonth ={
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  }
  return numToMonth[month] + ' ' + day + ', ' + year;
}

function Capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function BuildProfile(props) {
  const selectedUser = props.value;
  const userName = Capitalize(selectedUser.name.first) + ' ' + Capitalize(selectedUser.name.last);
  const profPic = selectedUser.picture.large;
  const state = Capitalize(selectedUser.location.state);
  const city = Capitalize(selectedUser.location.city);
  const dateRegistered = DateStrip(selectedUser.registered.date);

  return (
    <View>
      <Text style={styles.Banner}>Profile: {userName}</Text>
        <View style={styles.ProfileTop}>
          <Image style={styles.ProfPic} source={{uri: profPic}}/>
          <View style={styles.ProfileTopTextContainer}>
            <Text style={styles.ProfileTopText}>Name: {selectedUser.name.title.charAt(0).toUpperCase() + selectedUser.name.title.slice(1)} {userName}</Text>
            <Text style={styles.ProfileTopText}>Email: {selectedUser.email}</Text>
            <Text style={{fontSize: 14}}>City: {city}</Text>
            <Text style={{fontSize: 14}}>State: {state}</Text>
            <Text style={{fontSize: 14}}>Date Registered: {dateRegistered}</Text>
          </View>
        </View>
        <View style={{maxWidth: '20%', alignSelf: 'center'}}>
          <Button onPress={props.goBack} title='Go Back to Search' />
        </View>
    </View>
  )
}

function RandomUser(props) {
  const user = props.value;
  const userName = Capitalize(user.name.first) + ' ' + Capitalize(user.name.last);
  const thumb = user.picture.thumbnail;

  return (
    <TouchableHighlight onPress={props.onClick} underlayColor='white'>
      <View style={styles.User}>
        <Image style={styles.ThumbStyle} source={{uri: thumb}}></Image>
        <View style={styles.UserInfo}>
          <Text style={{fontWeight: 'bold', fontSize: 16, fontFamily: 'arial'}}>{userName}</Text>
          <Text style={{fontSize: 16, fontFamily: 'arial'}}>{user.email}</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}

class UserList extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      userList: true,
      selectedUser: null,
      results: []
    };
  }
  componentDidMount() {
    fetch('https://randomuser.me/api/?results=100&nat=us')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            results: result.results
          });
        },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  renderUser(i) {
    return (
      <RandomUser
        value={this.state.results[i]}
        onClick={() => this._handleClick(i)}
        key={i}/>
    )
  }

  _handleClick(i) {
      this.setState({
        userList: false,
        selectedUser: this.state.results[i]
    })
  }

  _goBack() {
    this.setState({
      userList: true,
      selectedUser: null,
    })
  }

  render() {
    const { error, isLoaded, userList, selectedUser, results } = this.state;
    if (error) {
      return <div>Error, {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (userList) {
      var i;
      var userData = [];
      console.log('loading user data...')
      for (i=0; i<results.length; i++) {
          userData.push(this.renderUser(i))
        }
      console.log('data loaded... displaying list')
      return(
        (
          <View style={styles.Wrapper}>
            <View style={styles.Container}>{userData}</View>
          </View>
        )
      )
    } else {
      return(
        <BuildProfile
          value={selectedUser}
          goBack={() => this._goBack()}
          key={i}
        />
      )
    }

  }
}

ReactDOM.render(<UserList />, document.getElementById("root"));
