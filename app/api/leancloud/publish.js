/**
 * Created by wanpeng on 2017/2/17.
 */
import AV from 'leancloud-storage'
import {List} from 'immutable'
import ERROR from '../../constants/errorCode'
import {Publish, PublishComment} from '../../models/publishModels'
import {Geolocation} from '../../components/common/BaiduMap'

export function publishService(payload) {
  let Publishes = AV.Object.extend('Publishes')
  let publish = new Publishes()
  let now = new Date()
  var user = AV.Object.createWithoutData('_User', payload.userId)

  return AV.GeoPoint.current().then(function (geoPoint) {
    if (geoPoint) {
      return Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then(function (position) {
        publish.set('geoPoint', geoPoint)
        publish.set('position', position)
        publish.set('user', user)
        publish.set('imgGroup', payload.imgGroup)
        publish.set('title', payload.title)
        publish.set('content', payload.content)
        publish.set('price', payload.price)
        publish.set('type', 'service')
        publish.set('commentCnt', 0)
        publish.set('status', 1)
        publish.set('lastRefreshAt', now)

        return publish.save().then(function (result) {
          let newPublish = result
          newPublish.attributes.user = AV.User.current()
          return Publish.fromLeancloudObject(newPublish)
        }, function (error) {
          error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
          throw error
        })
      }, function (error) {
        error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
        throw error
      })
    } else {
      publish.set('user', user)
      publish.set('imgGroup', payload.imgGroup)
      publish.set('title', payload.title)
      publish.set('content', payload.content)
      publish.set('price', payload.price)
      publish.set('type', 'service')
      publish.set('commentCnt', 0)
      publish.set('status', 1)
      publish.set('lastRefreshAt', now)

      return publish.save().then(function (result) {
        let newPublish = result
        newPublish.attributes.user = AV.User.current()
        return Publish.fromLeancloudObject(newPublish)
      }, function (error) {
        error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
        throw error
      })
    }
  }, function (error) {
    publish.set('user', user)
    publish.set('imgGroup', payload.imgGroup)
    publish.set('title', payload.title)
    publish.set('content', payload.content)
    publish.set('price', payload.price)
    publish.set('type', 'service')
    publish.set('commentCnt', 0)
    publish.set('status', 1)
    publish.set('lastRefreshAt', now)

    return publish.save().then(function (result) {
      let newPublish = result
      newPublish.attributes.user = AV.User.current()
      return Publish.fromLeancloudObject(newPublish)
    }, function (error) {
      error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
      throw error
    })
  })

}

export function publishHelp(payload) {
  let Publishes = AV.Object.extend('Publishes')
  let publish = new Publishes()
  let now = new Date()

  var user = AV.Object.createWithoutData('_User', payload.userId)

  return AV.GeoPoint.current().then(function (geoPoint) {
    if (geoPoint) {
      return Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then(function (position) {
        publish.set('geoPoint', geoPoint)
        publish.set('position', position)
        publish.set('user', user)
        publish.set('imgGroup', payload.imgGroup)
        publish.set('title', payload.title)
        publish.set('content', payload.content)
        publish.set('price', payload.price)
        publish.set('type', 'help')
        publish.set('commentCnt', 0)
        publish.set('status', 1)
        publish.set('lastRefreshAt', now)

        return publish.save().then(function (result) {
          let newPublish = result
          newPublish.attributes.user = AV.User.current()
          return Publish.fromLeancloudObject(newPublish)
        }, function (error) {
          error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
          throw error
        })
      }, function (error) {
        error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
        throw error
      })
    } else {
      publish.set('user', user)
      publish.set('imgGroup', payload.imgGroup)
      publish.set('title', payload.title)
      publish.set('content', payload.content)
      publish.set('price', payload.price)
      publish.set('type', 'help')
      publish.set('commentCnt', 0)
      publish.set('status', 1)
      publish.set('lastRefreshAt', now)

      return publish.save().then(function (result) {
        let newPublish = result
        newPublish.attributes.user = AV.User.current()
        return Publish.fromLeancloudObject(newPublish)
      }, function (error) {
        error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
        throw error
      })
    }
  }, function (error) {
    publish.set('user', user)
    publish.set('imgGroup', payload.imgGroup)
    publish.set('title', payload.title)
    publish.set('content', payload.content)
    publish.set('price', payload.price)
    publish.set('type', 'help')
    publish.set('commentCnt', 0)
    publish.set('status', 1)
    publish.set('lastRefreshAt', now)

    return publish.save().then(function (result) {
      let newPublish = result
      newPublish.attributes.user = AV.User.current()
      return Publish.fromLeancloudObject(newPublish)
    }, function (error) {
      error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
      throw error
    })
  })
}

export function updateService(payload) {
  console.log("updateService")
  var publish = AV.Object.createWithoutData('Publishes', payload.publishId)

  publish.set('imgGroup', payload.imgGroup)
  publish.set('title', payload.title)
  publish.set('content', payload.content)
  publish.set('price', payload.price)
  publish.set('type', 'service')

  return publish.save().then(function (result) {
    let newPublish = result
    newPublish.attributes.user = AV.User.current()
    return Publish.fromLeancloudObject(newPublish)
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}
export function updateHelp(payload) {
  console.log("updateHelp")
  var publish = AV.Object.createWithoutData('Publishes', payload.publishId)

  publish.set('imgGroup', payload.imgGroup)
  publish.set('title', payload.title)
  publish.set('content', payload.content)
  publish.set('price', payload.price)
  publish.set('type', 'help')

  return publish.save().then(function (result) {
    let newPublish = result
    newPublish.attributes.user = AV.User.current()
    return Publish.fromLeancloudObject(newPublish)
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function getPublishedByUserId(payload) {
  let userId = payload.userId
  var userInfo = AV.Object.createWithoutData('_User', userId)
  var publish = new AV.Query('Publishes')

  publish.equalTo('user', userInfo)
  publish.descending('createdAt')

  return publish.find().then(function (results) {
    let publishes = []
    if (results) {
      results.forEach((record) => {
        publishes.push(Publish.fromLeancloudObject(record))
      })
    }
    return new List(publishes)
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function fetchPublishes(payload) {
  let query = new AV.Query('Publishes')
  query.equalTo('type', payload.type)
  query.equalTo('status', 1)

  let isRefresh = payload.isRefresh
  let lastRefreshAt = undefined
  if(payload.lastRefreshAt) {
    lastRefreshAt = new Date(payload.lastRefreshAt)
  } else {
    lastRefreshAt = new Date()
  }

  if (!isRefresh && lastRefreshAt) { //分页查询
    query.lessThan('lastRefreshAt', new Date(lastRefreshAt))
  }
  query.include('user')
  query.limit(10)
  query.descending('lastRefreshAt')

  return query.find().then(function (results) {
    let publishes = []
    if(results) {
      results.forEach((record) => {
        publishes.push(Publish.fromLeancloudObject(record))
      })
      return new List(publishes)
    }
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function publishComments(payload) {
  let PublishComments = AV.Object.extend('PublishComments')
  let publishComment = new PublishComments()

  var publish = AV.Object.createWithoutData('Publishes', payload.publishId)
  var user = AV.Object.createWithoutData('_User', payload.userId)

  if(payload.commentId) {
    var parentComment = AV.Object.createWithoutData('PublishComments', payload.commentId)
    publishComment.set('parentComment', parentComment)
  }
  publishComment.set('publish', publish)
  publishComment.set('user', user)
  publishComment.set('content', payload.content)
  
  return publishComment.save().then(function (result) {
    if(result) {
      let relation = publish.relation('comments')
      relation.add(publishComment)
      publish.increment("commentCnt", 1)

      let newPublishComment = result
      newPublishComment.attributes.user = AV.User.current()

      return publish.save().then(function (result) {
        if(payload.commentId) {
          var query = new AV.Query('PublishComments');
          query.include(['user'])
          return query.get(payload.commentId).then(function (result) {
            newPublishComment.attributes.parentComment = result
            return PublishComment.fromLeancloudObject(newPublishComment)
          }, function (error) {
            error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
            throw error
          })
        } else {
          return PublishComment.fromLeancloudObject(newPublishComment)
        }
      }, function (error) {
        error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
        throw error
      })
    }

  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function getPublishComments(payload) {
  let publishId = payload.publishId

  let publish = AV.Object.createWithoutData('Publishes', publishId)
  let relation = publish.relation('comments')
  let query = relation.query()
  query.include(['user']);
  query.include(['parentComment']);
  query.include(['parentComment.user']);
  query.descending('createdAt')
  return query.find().then(function (results) {
      let publishComments = []
      if (results) {
        results.forEach((result) => {
          publishComments.push(PublishComment.fromLeancloudObject(result))
        })
      }
      return new List(publishComments)
    }
    , function (err) {
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })

}

export function updatePublishStatus(payload) {
  console.log("updatePublishStatus payload", payload)
  let publishId = payload.publishId
  let status = payload.status

  let publish = AV.Object.createWithoutData('Publishes', publishId)
  publish.set('status', status)

  return publish.save().then(function (result) {
    return true
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function updateRefreshTime(payload) {
  let publishId = payload.publishId
  let refreshTime = payload.refreshTime

  let publish = AV.Object.createWithoutData('Publishes', publishId)
  publish.set('lastRefreshAt', refreshTime)

  return publish.save().then(function (result) {
    // console.log("result", result)
    // let newPublish = result
    // newPublish.attributes.user = AV.User.current()
    // return Publish.fromLeancloudObject(newPublish)
    return true
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function favoritePublish(payload) {
  let publishId = payload.publishId
  let publish = AV.Object.createWithoutData('Publishes', publishId)

  let own = AV.User.current()
  let relation = own.relation('favorites')
  let query = relation.query()

  return query.find().then((favorites) => {
    if(favorites.includes(publish)){
      console.log("已经关注！")
      return undefined
    }
    relation.add(publish)
    return own.save().then((result) => {
      return publish.fetch({include: ['user']}).then((record) =>{
        return {publish: Publish.fromLeancloudObject(record)}
      }, function (error) {
        error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
        throw error
      })
    }, function (error) {
      error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
      throw error
    })
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })

}


export function UnFavoritePublish(payload) {
  let publishId = payload.publishId
  let publish = AV.Object.createWithoutData('Publishes', publishId)

  let own = AV.User.current()
  let relation = own.relation('favorites')
  let query = relation.query()

  return query.find().then(favorites => {
    if(favorites.includes(publish)) {
      relation.remove(publish)
      return own.save().then((result) => {
        return true
      }, function (error) {
        error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
        throw error
      })
    }
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}














