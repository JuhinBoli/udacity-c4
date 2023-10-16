import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createSong, deleteSong, getSongs, patchSong } from '../api/songs-api'
import Auth from '../auth/Auth'
import { Song } from '../types/Song'

interface SongsProps {
  auth: Auth
  history: History
}

interface SongsState {
  songs: Song[]
  newSongName: string
  author: string
  singer: string
  loadingSongs: boolean
}

export class Songs extends React.PureComponent<SongsProps, SongsState> {
  state: SongsState = {
    songs: [],
    newSongName: '',
    author: '',
    singer: '',
    loadingSongs: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSongName: event.target.value })
  }

  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ author: event.target.value })
  }
  
  handleSingerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ singer: event.target.value })
  }

  onEditButtonClick = (songId: string) => {
    this.props.history.push(`/songs/${songId}/edit`)
  }

  onSongCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const releaseDate = this.calculateReleaseDate()
      const newSong = await createSong(this.props.auth.getIdToken(), {
        name: this.state.newSongName,
        author: this.state.author,
        singer: this.state.singer,
        releaseDate
      })
      this.setState({
        songs: [...this.state.songs, newSong],
        newSongName: ''
      })
    } catch {
      alert('Song creation failed')
    }
  }

  onSongDelete = async (songId: string) => {
    try {
      await deleteSong(this.props.auth.getIdToken(), songId)
      this.setState({
        songs: this.state.songs.filter(song => song.songId !== songId)
      })
    } catch {
      alert('Song deletion failed')
    }
  }

  onSongCheck = async (pos: number) => {
    try {
      const song = this.state.songs[pos]
      await patchSong(this.props.auth.getIdToken(), song.songId, {
        name: song.name,
        author: song.author,
        singer: song.singer,
        done: !song.done
      })
      this.setState({
        songs: update(this.state.songs, {
          [pos]: { done: { $set: !song.done } }
        })
      })
    } catch {
      alert('Song deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const songs = await getSongs(this.props.auth.getIdToken())
      this.setState({
        songs,
        loadingSongs: false
      })
    } catch (e) {
      alert(`Failed to fetch songs: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">SONGS</Header>

        {this.renderCreateSongInput()}

        {this.renderSongs()}
      </div>
    )
  }

  renderCreateSongInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New song',
              onClick: this.onSongCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Add to your play list"
            onChange={this.handleNameChange}
          />
          <Input placeholder='Author' onChange={this.handleAuthorChange}/>
          <Input placeholder='Singer' onChange={this.handleSingerChange}/>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderSongs() {
    if (this.state.loadingSongs) {
      return this.renderLoading()
    }

    return this.renderSongsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading SONGS
        </Loader>
      </Grid.Row>
    )
  }

  renderSongsList() {
    return (
      <Grid padded>
        {this.state.songs.map((song, pos) => {
          return (
            <Grid.Row key={song.songId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onSongCheck(pos)}
                  checked={song.done}
                />
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {song.name}
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle">
                {song.author}
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle">
                {song.singer}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {song.releaseDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(song.songId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onSongDelete(song.songId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {song.attachmentUrl && (
                <Image src={song.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateReleaseDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
