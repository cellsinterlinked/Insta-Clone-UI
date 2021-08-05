import React, { useState, useEffect } from 'react';
import './Activity.css';
import { BsHeart } from 'react-icons/bs';
import BottomNav from '../Components/Navigation/BottomNav';

const Activity = () => {
  return (
    <div className="activity-wrapper">
      <div className="activity-header">
        <p>Activity</p>
      </div>

    <div className="no-activity-wrapper">
      <div className="no-activity-circle">
        <BsHeart className="no-activity-icon"/>
      </div>
      <h1>Activity On Your Posts</h1>
      <p>When someone likes or comments on one of your posts, you'll see it here.</p>
      <a href="/create">Share your first photo.</a>
    </div>
    <BottomNav />
    </div>
  )
}

export default Activity;