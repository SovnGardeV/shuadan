
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    router: ['Nested'],
    introduction: 'I am a super administrator',
    avatar: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1260305692,2555177882&fm=26&gp=0.jpg',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    router: [],
    introduction: 'I am an editor',
    avatar: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1260305692,2555177882&fm=26&gp=0.jpg',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/instead-pay-web/login',
    type: 'post',
    response: config => {
      const { commercialName } = config.body
      const token = tokens[commercialName]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/user/register',
    type: 'post',
    response: config => {
      const { userName } = config.body
      const token = tokens[userName]

      // mock error
      if (token) {
        return {
          code: 60204,
          message: '注册失败'
        }
      }

      return {
        code: 20000,
        data: {
          token: 'admin-token'
        }
      }
    }
  }
]
