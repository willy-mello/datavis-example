import React from 'react'
import axios from 'axios'
import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, scopes } from '../.scrt.js'
import { decode as atob, encode as btoa } from 'base-64'
import { PieChart } from 'react-charts-d3'

class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      data: [
        { label: 'Group 1', value: 23 },
        { label: 'Group 2', value: 15 },
        { label: 'Group 3', value: 23 },
        { label: 'Group 4', value: 15 },
        { label: 'Group 5', value: 23 },
        { label: 'Group 6', value: 15 }
      ]
    }
    this.handleAuth = this.handleAuth.bind(this)

  }

  handleAuth = async () => {
    try {
      const result = await axios.get('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' +
        CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' +
        encodeURIComponent(CALLBACK_URL)
      )
      console.log('rsult', result)

      const spotifyAuthCode = result.params.code;
      const credsB64 = btoa(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      );
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${spotifyAuthCode}&redirect_uri=${
          CALLBACK_URL
          }`,

      });

      const responseJson = await response.json();

      const {
        access_token,
        refresh_token,
        expires_in,
      } = responseJson;
      const localData = window.localStorage
      await localData.setItem('accessToken', access_token);
      const token_check = await localData.getItem('accessToken')
      console.log('access_token in localstorage', token_check)
      await localData.setItem('refreshToken', refresh_token);
      await localData.setItem(
        'expirationTime',
        JSON.stringify(expires_in)
      );

    } catch (error) {
      console.log(error)
    }

  }
  render() {
    return (
      <div>
        Hello
        <PieChart data={this.state.data} />
        <button onClick={() => this.handleAuth()}>Click Me</button>
      </div>
    )
  }
}
export default Main