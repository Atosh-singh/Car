import { Drawer } from "antd";

function AppDrawer({ title, open, onClose, children, width = 500 }) {
  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      destroyOnClose
    >
      {children}
    </Drawer>
  );
}

export default AppDrawer;