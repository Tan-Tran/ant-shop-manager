import { Button } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
const AddNewRowButton = (props) => {
  const { addNewRow, title, ...restProps } = props;
  return (
    <div style={{ width: '100%' }}>
      <Button
        style={{
          width: '100%',
          color: '#1890ff',
          backgroundColor: '#cccc',
          borderColor: '#cccc',
        }}
        type="primary"
        onClick={addNewRow}
        {...restProps}
      >
        <AppstoreAddOutlined /> {title}
      </Button>
    </div>
  );
};

export default AddNewRowButton;
