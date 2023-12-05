'use client';

import ChatBubble from "../../components/ChatBubble";
import ChatLayout from "../../components/chatLayout";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import PostModal from "@/components/PostModal";

export default function Chat({}) {
  const [chats, setChats] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [newMsg, setNewMsg] = useState<boolean>(false);
  const chatLayoutRef = useRef<HTMLDivElement>(null);


  const dummyChats = [
    {
      id: 1,
      msg: "Hello",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
    {
      id: 2,
      msg: "Hi",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
    {
      id: 3,
      msg: "Sup",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
    {
      id: 4,
      msg: "I'm good, how are you?",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
    {
      id: 5,
      msg: "lol",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
    {
      id: 6,
      msg: // a very long message to test the chat layout
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae semper libero. Nullam vitae nunc eget dolor fermentum maximus. Nulla facilisi. Nulla facilisi. Sed et aliquet lorem. Donec euismod, purus sed ultricies dictum, nisl neque ultricies nisl, vitae lacinia nisl nisl at odio. Nulla facilisi. Donec euismod, purus sed ultricies dictum, nisl neque ultricies nisl, vitae lacinia nisl nisl at odio. Nulla facilisi. Donec euismod, purus sed ultricies dictum, nisl neque ultricies nisl, vitae lacinia nisl nisl at odio. Nulla facilisi. Donec euismod, purus sed ultricies dictum, nisl neque ultricies nisl, vitae lacinia nisl nisl at odio. Nulla facilisi. Donec euismod, purus sed ultricies dictum, nisl neque ultricies nisl, vitae lacinia nisl nisl at odio. Nulla facilisi. Donec euismod, purus sed ultricies dictum, nisl neque ultricies nisl, vitae lacinia nisl nisl at odio. Nulla facilisi. Donec euismod, purus sed ultricies dictum, nisl neque ultricies nisl, vitae lacinia nisl nisl at odio.",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
    {
      id: 7,
      msg: "Hello",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
    {
      id: 8,
      msg: "Hi",
      username: "Username",
      userImg: "https://images.pexels.com/photos/16177320/pexels-photo-16177320/free-photo-of-light-vacation-people-festival.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      timestamp: Date.now(),
    },
  ];

  useEffect(() => {
    if (newMsg) {
      const userChat = {
        id: chats.length + 1,
        message: message,
        timestamp: Date.now(),
        user: true,
      };

      setChats((prevChats) => [...prevChats, userChat]);

      const replyChat = {
        id: chats.length + 2,
        message: "Hi " + message,
        timestamp: Date.now(),
        user: false,
      };


      setTimeout(() => {
        setChats((prevChats) => [...prevChats, replyChat]);
      }, 1000);

      setMessage("");
      setNewMsg(false);
    }
    if (chatLayoutRef.current) {
         chatLayoutRef.current.scrollTop =
           chatLayoutRef.current.scrollHeight +
           chatLayoutRef.current.clientHeight;

      }
  }, [newMsg, message, chats.length]);


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }
    setNewMsg(true);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    chatLayoutRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <main className="flex dark:bg-darkBg overflow-y-hidden max-h-screen mx-auto">
      <Sidebar />
      <div className="flex h-screen w-full">
        <div className="mainContent max-h-screen flex-col w-full xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor sm:ml-[82px] flex-grow">
          <Navbar title={"Chat"} />
          <div className="mainSection flex flex-row relative">
            <div className="mainContent h-screen pt-20 pb-48 my-auto grow md:w-96 absolute overflow-y-scroll flex-1 flex-col border-r mx-auto">
              {dummyChats.map((chat) => (
                <ChatLayout
                  key={chat.id}
                  userImg={chat.userImg}
                  username={chat.username}
                  msg={chat.msg}
                  timestamp={chat.timestamp}
                />
              ))}
            </div>
            <div className="chatLayout flex flex-col md:ml-96 w-full h-screen relative">
              <div className="chatLayout transition-all duration-300 pt-20 pb-48 overflow-auto px-4 flex h-screen bg-gray-200 dark:bg-darkBg flex-col w-full">
                <ChatBubble
                  user={true}
                  message={"Hello"}
                  timestamp={Date.now() - 1000}
                />
                <ChatBubble
                  user={false}
                  message={"Hi"}
                  timestamp={Date.now()}
                />

                {chats.map((chat: any) => (
                  <ChatBubble
                    key={chat.id}
                    user={chat.user}
                    timestamp={chat.timestamp}
                    message={chat.message}
                  />
                ))}

                <div ref={chatLayoutRef} />
              </div>
              <div className="flex absolute mr-2 bottom-1 left-0 right-0 justify-start self-center flex-row items-center w-full h-12">
                <input
                  type="text"
                  className="w-11/12 focus:ring-0 h-full dark:bg-darkCard dark:text-white rounded-full border focus:border-gray-400 border-gray-300 px-4"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
                <button
                  className="hover:brightness-90 h-full ml-3 p-3 rounded-full bg-primary text-white"
                  onClick={sendMessage}
                >
                  <PaperAirplaneIcon className="h-6 w-6 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PostModal updatePosts={undefined} type={"post"} />
    </main>
  );
}
