import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { UserIcon, LockIcon, SettingsIcon, BellIcon } from "@stdui/icons";

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="general" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p className="text-sm p-4">Manage your account settings and preferences.</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="text-sm p-4">Change your password and security options.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-sm p-4">Configure notification preferences.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-[450px]">
      <TabsList>
        <TabsTrigger value="profile">
          <UserIcon /> Profile
        </TabsTrigger>
        <TabsTrigger value="security">
          <LockIcon /> Security
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon /> Settings
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <BellIcon /> Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <p className="text-sm p-4">Update your profile information.</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="text-sm p-4">Manage passwords and two-factor authentication.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm p-4">Application preferences and configuration.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-sm p-4">Choose what notifications you receive.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList className="w-full">
        <TabsTrigger value="overview" className="flex-1">
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex-1">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex-1">
          Reports
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm p-4">Overview content with key metrics.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="text-sm p-4">Detailed analytics and charts.</p>
      </TabsContent>
      <TabsContent value="reports">
        <p className="text-sm p-4">Generated reports and exports.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="text-sm p-4">This tab is active.</p>
      </TabsContent>
      <TabsContent value="other">
        <p className="text-sm p-4">This tab is also available.</p>
      </TabsContent>
    </Tabs>
  ),
};
