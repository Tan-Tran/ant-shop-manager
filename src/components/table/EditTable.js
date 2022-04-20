import React, { useEffect, useState } from 'react';
import {Table,Form,Popconfirm,Typography,Space,DatePicker,message} from 'antd';
import EditableCell from './EditTableCell';
import AddNewRowButton from './button/AddNewRowButton';
import moment from 'moment';
import { FormatDate_DD_MM_YYY } from '../../constant/FormatDate';

const convertData = (data, columns) => {
  const outputData = { ...data };
  for (const column of columns) {
    if (column.inputType === DatePicker) {
      return {
        ...outputData,
        [`${column.dataIndex}`]: moment(outputData[column.dataIndex]).format( FormatDate_DD_MM_YYY),
      };
    }
  }
  return outputData;
};

const isExistNewRow = (data) => {
  return data.filter((item) => item?.isNew).length !== 0 ? true : false;
};

const EditTable = (props) => {
  const { formOutside, columns, dataSource, pagination, type,
          onSave, onAdd, onUpdate, onDelete, onCancel, onChange,
          showAddNewRow = true, useActionColumnDefault = true, rowKey = 'key',
          ...restProps
  } = props;

  const [formEditTable] = Form.useForm();
  const [dataSourceTable, setDataSourceTable] = useState([]);
  const [editingKeys, setEditingKeys] = useState([]);
  const form = formOutside || formEditTable;

  useEffect(() => {
    if(dataSource){
      setDataSourceTable(dataSource);
    }
  }, [dataSource]);

  useEffect(() =>{
      onChange?.(form.getFieldsValue())
  },[dataSourceTable])

  const isEditing = (record) => {
    if (type === 'multiple') {
      return true;
    }
    return editingKeys.find((key) => key === record.key) ? true : false;
  };

  const triggerOnChange = async (recordKey) => {
    const data = form.getFieldValue(recordKey);
    const dataIndex = dataSourceTable.findIndex((item) => item.key === recordKey);
    const newDataSource = [...dataSourceTable];
    newDataSource[dataIndex] = {
      ...newDataSource[dataIndex],
      ...convertData(data, columns),
    };
    setDataSourceTable(newDataSource)
  };

  const cancel = (record) => {
    if (record.isNew) {
      setDataSourceTable([...dataSourceTable].filter((item) => item.key !== record.key));
    }
    setEditingKeys([...editingKeys].filter((key) => key !== record.key));
  };

  const edit = (record) => {
    setEditingKeys([...editingKeys, record.key]);
  };

  const save = async (record) => {
    await form.validateFields()
    const { isNew, key, ...restProps} = record;
    onSave({ isNew, key, data: restProps });
    setEditingKeys([]);
  };

  const remove = (key) => {
    onDelete(key)
  }

  const addNewRow = () => {
    if (!type && isExistNewRow(dataSourceTable)) {
      message.warn('Please complete add current row');
      return;
    }
    const key = 'new_'+Date.now();
    let newData = {
      [`${rowKey}`]: key,
      isNew: true,
    };
    setDataSourceTable([...dataSourceTable, { ...newData }]);
    setEditingKeys([...editingKeys, key]);
  };

  const deleteMultipleMode = async (key) =>{
    setDataSourceTable([...dataSourceTable].filter((data) => data.key !== key));
    await form.validateFields()
  }

  const columnsDefault = [
    ...columns,
    {
      title: 'Action',
      dataIndex: 'action',
      style: {
        width: '20%',
      },
      render: (_, record) => {
        const editable = isEditing(record);
        if (type === 'multiple') {
          return (
            <Typography.Link
              onClick={() => deleteMultipleMode(record.key)}
            >
              Delete
            </Typography.Link>
          );
        }
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{marginRight: 8}}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => cancel(record)}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Space>
              <Typography.Link
                disabled={editingKeys.length !== 0}
                onClick={() => edit(record)}
              >
                Edit
              </Typography.Link>
              <Typography.Link
                disabled={editingKeys.length !== 0}
                onClick={() =>{remove(record.key)}}
              >
                Delete
              </Typography.Link>
            </Space>
          </span>
        );
      },
    },
  ];

  let columnsTable = columnsDefault;
  if (!useActionColumnDefault) {
    columnsTable.pop();
  }

  const mergeColumns = columnsTable.map((column) => {
    if (!column.editable) {
      return column;
    }
    return {
      ...column,
      onCell: (record) => ({
        record,
        form: form,
        editable: column.editable,
        inputType: column.inputType,
        dataIndex: column.dataIndex,
        title: column.title,
        onChange: triggerOnChange,
        editing: isEditing(record),
        formItemProps: column.formItemProps,
        elementProps: column.elementProps,
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergeColumns}
          dataSource={dataSourceTable}
          pagination={pagination}
          {...restProps}
          rowKey={rowKey || 'key'}
        />
      </Form>
      {showAddNewRow && (<AddNewRowButton addNewRow={addNewRow} title={'Add new row'} />)}
    </>
  );
};

export default EditTable;
