import { getLocalUser } from '@utils'
import { isEmpty } from 'lodash'

class Fetch {
  #user

  constructor(user = getLocalUser()) {
    if (!Fetch.instance) {
      this.#user = user
      Fetch.instance = this
    }
    return Fetch.instance
  }

  handleResponse = async (response) => {
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      const { data, error } = await response.json()
      if (error) {
        throw new Error(error.message)
      }
      return data
    }

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return null
  }

  async GET(url) {
    if (!this.#user || isEmpty(this.#user)) {
      return null
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.#user.token}`,
      },
    })

    return this.handleResponse(response)
  }

  async POST(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.#user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return this.handleResponse(response)
  }

  async PUT(url, body) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.#user.token}`,
      },
      body: JSON.stringify(body),
    })

    return this.handleResponse(response)
  }

  async DELETE(url) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.#user.token}`,
      },
    })

    return this.handleResponse(response)
  }
}

const _fetch = new Fetch()

export default _fetch
