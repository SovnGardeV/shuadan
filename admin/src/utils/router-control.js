import { asynRouter, constantRoutes } from '@/router'
import router from '@/router'
import store from '@/store'

const route = asynRouter
const pathArray = []

addRoutePath(pathArray, route)

function addRoutePath(arrOfPath, routes, fatherPath) {
  routes.forEach((item) => {
    const path = fatherPath ? ((fatherPath || '') + '/' + item.path) : item.path
    arrOfPath.push(path)

    if (item.children) {
      return addRoutePath(arrOfPath, item.children, path)
    }
  })

  return arrOfPath
}

export const asynRoutePath = pathArray

export default function addRouter() {
  const localRouter = store.getters.router

  for (let i = 0; i < route.length; i++) {
    if (localRouter.indexOf(route[i].menuName) > -1) continue

    route.splice(i, 1)
    i--
  }

  // resetRouter()
  router.options.routes = constantRoutes.concat(route)
  router.addRoutes(route)
}
