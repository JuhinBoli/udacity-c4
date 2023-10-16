import * as React from 'react'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getSongs, getUploadUrl, patchSong, uploadFile } from '../api/songs-api'
import { Song } from '../types/Song'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditSongProps {
  match: {
    params: {
      songId: string
    }
  }
  auth: Auth
}

interface EditSongState {
  songs: Song[]
  file: any
  uploadState: UploadState
  newSongName: string
  author: string
  singer: string
  done: boolean
}

export class EditSong extends React.PureComponent<
  EditSongProps,
  EditSongState
> {
  state: EditSongState = {
    songs: [],
    newSongName: '',
    author: '',
    singer: '',
    file: undefined,
    uploadState: UploadState.NoUpload,
    done: true
  }

  async componentDidMount() {
    try {
      const songs = await getSongs(this.props.auth.getIdToken())
      this.setState({
        songs
      })
      songs.map((song, pos) => {
        if (song.songId == this.props.match.params.songId) {
          this.setState({
            done: song.done
          })
        }
      })
    } catch (e) {
      alert(`Failed to fetch books: ${(e as Error).message}`)
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSongName: event.target.value })
  }


  onBookUpdate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newSong = await patchSong(this.props.auth.getIdToken(), this.props.match.params.songId, {
        name: this.state.newSongName,
        author: this.state.author,
        singer: this.state.singer,
        done: this.state.done
      })
      alert("Update song successful")
      
    } catch {
      alert('Update song failed')
    }
  }

  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ author: event.target.value })
  }
  
  handleSingerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ singer: event.target.value })
  }


  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.songId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
        <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'edit',
              content: 'Update song',
              onClick: this.onBookUpdate
            }}
            fluid
            actionPosition="left"
            placeholder="Name of song"
            onChange={this.handleNameChange}
          />
          <Input placeholder='Author' onChange={this.handleAuthorChange}/>
          <Input placeholder='Singer' onChange={this.handleSingerChange}/>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
