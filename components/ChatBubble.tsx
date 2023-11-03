import Image from 'next/image'
import Moment from 'react-moment'

export default function ChatBubble({ user, message, timestamp }) {

  return (
    <div
      className={`flex mx-4 sm:max-w-sm max-w-[300px] ${
        user == true ? "self-end bg-gray-50" : "bg-primary"
      } md:max-w-sm h-max my-2 p-4 first:rounded-tl-[0px] rounded-t-[20px] rounded-b-[20px]`}
    >
      <div className="flex pfpLayout mx-2 w-fit h-[50px]">
        <Image
          width="50"
          height="50"
          alt="profile picture"
          src="https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className=" w-max rounded-full object-cover"
        ></Image>
      </div>
      <div className="flex w-full flex-col justify-between items-start">
        <div className="flex w-full flex-row justify-start items-center">
          <p className="text-text text-lg font-bold">Username</p>
          <div className="flex w-full flex-row justify-end items-center">
            <p className="text-text text-sm font-bold mx-1">
              {timestamp ? <Moment fromNow>{timestamp}</Moment> : "12:00 PM"}
            </p>
          </div>
        </div>
        <div className="flex max-w-xs flex-row justify-start items-center">
          <p className="text-text text-base">{message}</p>
        </div>
      </div>
    </div>
  );
}