import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [priority, setpriority] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");

  const { admin, isAuthenticated } = useAuth();

  const [newNotification, setNewNotification] = useState({
    adminId: "",
    priority: "",
    details: "",
    email: "",
    title: "",
    notification_type: "",
  });

  useEffect(() => {
    if (admin?.admin_id) {
      setNewNotification((prev) => ({
        ...prev,
        adminId: admin.admin_id,
        email: admin.email,
        notification_type: "user",
      }));
      fetchNotifications(admin.admin_id);
    }
  }, [admin]);

  const fetchNotifications = async (adminId) => {
    const res = await axios.get(
      `https://aitool.asoroautomotive.com/api/notifications/admin`
    );
    setNotifications(res.data.data);
    res.data.data.forEach((item, i)=>{
      // console.log(item)
      updateNotificationSeen(item.id)
    })
    setFiltered(res.data.data);
  };

  const handleFilter = () => {
    let temp = [...notifications];
    if (priority) temp = temp.filter((n) => n.priority === priority);
    if (type) temp = temp.filter((n) => n.notification_type === type);
    if (date)
      temp = temp.filter(
        (n) => format(new Date(n.created_at), "yyyy-MM-dd") === date
      );
    setFiltered(temp);
  };

  const handlePostNotification = async () => {
    await axios.post(
      "https://aitool.asoroautomotive.com/api/notify/admin",
      newNotification
    );
    setNewNotification((prev) => ({
      ...prev,
      priority: "",
      details: "",
      title: "",
    }));
    fetchNotifications(admin.admin_id);
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `https://aitool.asoroautomotive.com/api/notifications/admin/${id}`
    );
    fetchNotifications(admin.admin_id);
  };

      const updateNotificationSeen = async (NotificationId: string) => {
    try {
      const response = await axios.put(
        `https://aitool.asoroautomotive.com/api/notice-seen/${NotificationId}`
      );
      console.log("Notification marked as seen:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error marking Notification as seen:", error);
    }
  };

  //   const handleDeleteAll = async () => {
  //     await axios.delete("https://aitool.asoroautomotive.com/api/notifications");
  //     fetchNotifications(admin.admin_id);
  //   };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Filter by Date (YYYY-MM-DD)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Select value={priority} onValueChange={setpriority}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleFilter}>Filter</Button>
      </div>

      {/* Post New Notification */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Post New Email Notification</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Title"
            value={newNotification.title}
            onChange={(e) =>
              setNewNotification({ ...newNotification, title: e.target.value })
            }
          />

          <Input
            placeholder="Message"
            value={newNotification.details}
            onChange={(e) =>
              setNewNotification({
                ...newNotification,
                details: e.target.value,
              })
            }
          />

          <Select
            value={newNotification.priority}
            onValueChange={(val) =>
              setNewNotification({ ...newNotification, priority: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          {/* <Select
            value={newNotification.notification_type}
            onValueChange={(val) =>
              setNewNotification({ ...newNotification, notification_type: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select> */}

          <Input
            placeholder="Admin ID"
            value={newNotification.adminId}
            disabled
          />

          <Input
            placeholder="Admin Email"
            value={newNotification.email}
            disabled
          />
        </div>

        <Button className="mt-4" onClick={handlePostNotification}>
          Post Notification
        </Button>
      </div>

      {/* Delete All */}
      {/* <Button variant="destructive" onClick={handleDeleteAll}>
        Delete All Notifications
      </Button> */}

      {/* Notification Cards */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  {filtered.map((n) => (
    <Card
      key={n.id}
      className={`transition-shadow duration-300 ${
        n.seen === "FALSE" 
          ? "border-2 border-blue-500 bg-blue-50 shadow-md"
          : "border border-gray-200 bg-white"
      }`}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h4 className={`text-lg font-semibold ${!n.seen ? "text-blue-700" : "text-gray-900"}`}>
            {n.title}
          </h4>
          {!n.seen && (
            <span className="inline-block px-2 py-0.5 text-xs font-semibold text-white bg-blue-600 rounded-full">
              New
            </span>
          )}
        </div>
        <p className="mb-3">{n.notification_details}</p>
        <p className="text-sm text-gray-500">
          {n.priority} | {format(new Date(n.created_at), "yyyy-MM-dd hh:mm a")}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => handleDelete(n.id)}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  ))}
</div>

    </div>
  );
};

export default NotificationsPage;
