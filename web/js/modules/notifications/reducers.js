import { requestReducer } from '../core/reducers';
import { getCount, separateByType, getPriority } from './util';
import {
  REQUEST_NOTIFICATIONS,
  SET_NOTIFICATIONS,
  NOTIFICATIONS_SEEN
} from './constants';
import { assign } from 'lodash';

const notificationState = {
  number: null,
  type: '',
  isActive: false,
  object: {}
};

export function notificationsRequest(state = {}, action) {
  return requestReducer(REQUEST_NOTIFICATIONS, state, action);
}

export function notificationsReducer(state = notificationState, action) {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      if (action.array.length > 0) {
        const sortedNotificationObject = separateByType(action.array);
        return assign({}, state, {
          number: getCount(sortedNotificationObject),
          type: getPriority(sortedNotificationObject),
          isActive: true,
          object: sortedNotificationObject
        });
      } else return state;
    case NOTIFICATIONS_SEEN:
      return assign({}, state, {
        number: null,
        type: null,
        isActive: true
      });
    default:
      return state;
  }
}