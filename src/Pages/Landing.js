import React, {useState} from 'react';
import './Landing.css';
import Post from './Post';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {BsHeart} from 'react-icons/bs';
import {IoChatbubbleOutline} from 'react-icons/io5';
import {IoPaperPlaneOutline} from 'react-icons/io5';
import {MdTurnedInNot} from 'react-icons/md';

const DUMMY_POSTS = [
  {
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    user: 'Scott_Billings',
    title: 'Japanese Morning',
    description: 'So happy to finally be in Japan! 3 days in Tokyo wasnt enough, but its time to go see the countryside!',
    comments: [
      {
        user: "Lauren",
        comment: 'So Beautiful!'
      },
      {
        user: "Anna",
        comment: 'Isnt it dangerous there?'
      }

    ]
  },
  { image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    user: 'Ken_Montgomery',
    title: 'Above The Clouds',
    description: 'Finally, some fresh air! Spent the whole morning hiking 10 miles for this gorgeous view!',
    comments: [
      {
        user: 'Scott',
        comment: 'You climb that by your self?'
      },
      {
        user: 'Lauren',
        comment: 'What camera did you use?'
      }
    ]

  }
]



const Landing  = ({users}) => {
  return (
    <div className='landing-wrapper'>
      <div className='post-list-wrapper'>
        {DUMMY_POSTS.map((post, index) => 
        <div className='post-wrapper' key={index}>
          <div className="post-header">
            <div className='post-header-pic-wrapper'>
              <img alt="" src={users.filter(user => user.name === post.user)[0].picture}/>
            </div>
            <p>{post.user}</p>
            <div className="dots-menu-wrapper">
              <BiDotsVerticalRounded className='menu-dots'/>
            </div>
          </div>
          <div className='post-image-wrapper'>
            <img src={post.image} alt="" />
          </div>
          <div className='post-icons-wrapper'> 
            <BsHeart className='post-icon'/>
            <IoChatbubbleOutline className='post-icon' />
            <IoPaperPlaneOutline className='post-icon'/>

            <MdTurnedInNot className='last-post-icon'/>


           </div>
          <div className='post-details-wrapper'>
            <p className='likes'> Liked by 100,000</p>
            <div className='post-description'>
            <p><strong>{post.user}</strong> {post.description}</p>
            
            </div>
          </div>
        </div>)}

      </div>
    </div>
  )
}

export default Landing;