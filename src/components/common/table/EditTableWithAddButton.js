import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import AddNewRowButton from './Button/AddNewRowButton';
import EditTable from './EditTableVersion2';

const EditTableWithAddButton = (props) => {
  const { columns, dataSource, pagination, onSave, onDelete, ...restProps } =
    props;
  const [data, setData] = useState(dataSource);
  const [isExistNewRow, setIsExistNewRow] = useState(false);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  const addNewRow = () => {
    if (isExistNewRow) {
      message.warn('Please complete add new customer');
      return;
    }
    let newData = {
      key: Date.now(),
      isNew: true,
    };
    for (const column of columns) {
      newData[`${column.dataIndex}`] = column.defaultValue;
    }
    setData([...data, { ...newData }]);
    setIsExistNewRow(true);
  };

  return (
    <>
      <EditTable
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onSave={({ key, data, method }) => onSave({ key, data, method })}
        {...restProps}
        onDelete={(key) => onDelete(key)}
      />
      <AddNewRowButton addNewRow={addNewRow} />
    </>
  );
};

export default EditTableWithAddButton;
