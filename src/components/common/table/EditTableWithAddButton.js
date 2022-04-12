import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import AddNewRowButton from './Button/AddNewRowButton';
import EditTable from './EditTableVersion2';

const EditTableWithAddButton = (props) => {
  const {
    type,
    columns,
    dataSource,
    pagination,
    onSave,
    onDelete,
    onEdit,
    ...restProps
  } = props;
  const [data, setData] = useState(dataSource);
  const [isExistNewRow, setIsExistNewRow] = useState(false);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  const addNewRow = () => {
    if (!type && isExistNewRow) {
      message.warn('Please complete add new customer');
      return;
    }
    let newData = {
      key: Date.now(),
      isNew: true,
    };
    for (const column of columns) {
      newData[`${column.dataIndex}`] = column.formItemProps?.initialValue;
    }
    setData([...data, { ...newData }]);
    setIsExistNewRow(true);
  };

  return (
    <>
      <EditTable
        type={type}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onSave={({ key, data, method }) => onSave({ key, data, method })}
        onDelete={(key) => onDelete(key)}
        onEdit={({ key, value, field }) => onEdit({ key, value, field })}
        {...restProps}
      />
      <AddNewRowButton addNewRow={addNewRow} />
    </>
  );
};

export default EditTableWithAddButton;
