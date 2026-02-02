import { User } from "@/state/api";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center rounded border p-4 shadow">
      {user.profilePictureUrl && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-xs font-semibold text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="ml-3">
        <h3>{user.username}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
