import React, { useState, useEffect, useContext } from 'react';
import './Activity.css';
import { BsHeart } from 'react-icons/bs';
import BottomNav from '../Components/Navigation/BottomNav';
import api from '../Static/axios';
import Notification from '../Components/Reusable/Notification';
import { isYesterday } from 'date-fns';
import { isThisWeek } from 'date-fns';
import { isThisMonth } from 'date-fns';
import { isSameYear } from 'date-fns';
import { isToday } from 'date-fns';
import { parse } from 'date-fns';
import { parseJSON } from 'date-fns';
import ErrorModal from '../Components/Reusable/ErrorModal';
import { BsChevronLeft } from 'react-icons/bs';
import { useHistory } from 'react-router';
import { AuthContext } from '../Context/auth-context';
import Modal from '../Components/Reusable/Modal';
import Spinner from '../Components/Reusable/Spinner';

const Activity = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const [user, setUser] = useState();
  const [users, setUsers] = useState();
  const [todayArr, setTodayArr] = useState([]);
  const [yesterdayArr, setYesterdayArr] = useState([]);
  const [weekArr, setWeekArr] = useState([]);
  const [monthArr, setMonthArr] = useState([]);
  const [yearArr, setYearArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingArr, setFollowingArr] = useState([]);
  const [showError, setShowError] = useState();
  const [error, setError] = useState();
  const history = useHistory();

  const clearNotifications = async () => {
    let res;
    try {
      res = await api.patch(`users/${myId}`, { activityNotifications: "clear" } )
    } catch (err) {
      setError('Couldnt clear notifications');
      setShowError(true);
      setTimeout(function () {
      setShowError(false);
      }, 2000);
      return
    }
    console.log(res, "why isnt this changing");
  }

  useEffect(() => {
    async function getUser() {
      let res;
      try {
        res = await api.get(`users/${myId}`);
      } catch (err) {
        setError('Could not get your information from server');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        return;
      }

      setUser(res.data.user);
      setTodayArr(
        res.data.user.activity.reverse().filter(
          (activity) => isToday(parseJSON(activity.date.fullDate)) === true && activity.user !== myId
        )
      );
      setYesterdayArr(
        res.data.user.activity.reverse().filter(
          (activity) => isYesterday(parseJSON(activity.date.fullDate)) === true && activity.user !== myId
        )
      );
      setWeekArr(
        res.data.user.activity.reverse().filter(
          (activity) =>
            isThisWeek(parseJSON(activity.date.fullDate)) === true &&
            isToday(parseJSON(activity.date.fullDate)) === false &&
            isYesterday(parseJSON(activity.date.fullDate)) === false && activity.user !== myId
        )
      );
      setMonthArr(
        res.data.user.activity.filter(
          (activity) =>
            isThisMonth(parseJSON(activity.date.fullDate)) === true &&
            isThisWeek(parseJSON(activity.date.fullDate)) === false && activity.user !== myId
        )
      );
      setYearArr(
        res.data.user.activity.reverse().filter(
          (activity) =>
            isSameYear(parseJSON(activity.date.fullDate), new Date()) ===
              true && isThisMonth(parseJSON(activity.date.fullDate)) === false && activity.user !== myId
        )
      );

      setFollowingArr(res.data.user.following);
      console.log(res.data.user.following);
    }
    getUser();
  }, [loading]);

  useEffect(() => {
    async function getUsers() {
      let res;
      try {
        res = await api.get(`users/`);
      } catch (err) {
        setUsers([]);
        setError("Couldn't get users");
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        return;
      }

      setUsers(res.data.users);
    }
    getUsers();
    clearNotifications()
  }, []);

  async function adjustFollow(user) {
    let res;
    try {
      res = await api.patch(`users/following/${myId}`, { otherUser: user });
    } catch (err) {
      setError('Something went wrong');
      setShowError(true);
      setTimeout(function () {
        setShowError(false);
      }, 2000);
    }
    if (followingArr.includes(user)) {
      setFollowingArr(followingArr.filter((u) => u !== user));
      setError('You unfollowed this user');
      setShowError(true);
    } else {
      setFollowingArr([...followingArr, user]);
      setError('You followed this user');
      setShowError(true);
    }
    setTimeout(function () {
      setShowError(false);
    }, 2000);
  }

  const followHandler = async (user) => {
    await adjustFollow(user);
    console.log(followingArr);
  };

  

  return (
    <>
      {(!user || !users || !myId) && <Spinner />}
      {user && users && myId && (
        <div className="activity-wrapper">
          <ErrorModal
            show={showError}
            children={<p className="errorText">{error}</p>}
          />

          <div className="activity-header">
            <div onClick={history.goBack} className="activity-back-navlink">
              <BsChevronLeft className="activity-back-icon" />
            </div>
            <p>Activity</p>
          </div>

          {user && user.activity.length === 0 && (
            <div className="no-activity-wrapper">
              <div className="no-activity-circle">
                <BsHeart className="no-activity-icon" />
              </div>
              <h1>Activity On Your Posts</h1>
              <p>
                When someone likes or comments on one of your posts, you'll see
                it here.
              </p>
              <a href="/create">Share a photo.</a>
            </div>
          )}

          {user && users && user.activity.length !== 0 && (
            <div className="activity-list-wrapper">
              {todayArr && todayArr.length > 0 && (
                <div className="activity-time-wrapper">
                  <p className="activity-time-header">Today</p>
                  {todayArr.map((activity, index) => (
                    <Notification
                      followingArr={followingArr}
                      followHandler={followHandler}
                      key={index}
                      activity={activity}
                      user={users.find((user) => user.id === activity.user)}
                      viewer={user}
                    />
                  ))}
                </div>
              )}

              {yesterdayArr && yesterdayArr.length > 0 && (
                <div className="activity-time-wrapper">
                  <p className="activity-time-header">Yesterday</p>
                  {yesterdayArr.map((activity, index) => (
                    <Notification
                      followingArr={followingArr}
                      followHandler={followHandler}
                      key={index}
                      activity={activity}
                      user={users.find((user) => user.id === activity.user)}
                      viewer={user}
                    />
                  ))}
                </div>
              )}

              {weekArr && weekArr.length > 0 && (
                <div className="activity-time-wrapper">
                  <p className="activity-time-header">This Week</p>
                  {weekArr.map((activity, index) => (
                    <Notification
                      followingArr={followingArr}
                      followHandler={followHandler}
                      key={index}
                      activity={activity}
                      user={users.find((user) => user.id === activity.user)}
                      viewer={user}
                    />
                  ))}
                </div>
              )}

              {monthArr && monthArr.length > 0 && (
                <div className="activity-time-wrapper">
                  <p className="activity-time-header">This Month</p>
                  {monthArr.map((activity, index) => (
                    <Notification
                      followingArr={followingArr}
                      followHandler={followHandler}
                      key={index}
                      activity={activity}
                      user={users.find((user) => user.id === activity.user)}
                      viewer={user}
                    />
                  ))}
                </div>
              )}

              {yearArr && yearArr.length > 0 && (
                <div className="activity-time-wrapper">
                  <p className="activity-time-header">This Year</p>
                  {yearArr.map((activity, index) => (
                    <Notification
                      followingArr={followingArr}
                      followHandler={followHandler}
                      key={index}
                      activity={activity}
                      user={users.find((user) => user.id === activity.user)}
                      viewer={user}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <BottomNav />
        </div>
      )}
    </>
  );
};

export default Activity;
