import React, { useEffect, useState } from 'react';
import EditableCell from './EditTableCell';
import moment from 'moment';
import { FormatDate_DD_MM_YYY } from '../../format/date/FormatDate';
import { Table, Form, DatePicker, Popconfirm, Typography, Space } from 'antd';
import AddNewRowButton from '../../common/table/button/AddNewRowButton';

const covertDataTypeDatePicker = (data, columns) => {
  for (const column of columns) {
    if (column.inputType === DatePicker) {
      return {
        ...data,
        [`${column.dataIndex}`]: moment(
          data[column.dataIndex],
          FormatDate_DD_MM_YYY
        ),
      };
    }
  }
};

const isExistActionColumns = (columns) => {
  return columns.find((column) => column.title === 'Action') ? true : false;
};

const EditTable = (props) => {
  const {
    formOutside,
    columns,
    dataSource,
    pagination,
    type,
    onSave,
    onAdd,
    onUpdate,
    onDelete,
    onCancel,
    onChange,
    ...restProps
  } = props;

  const [formInside] = Form.useForm();
  const form = formOutside || formInside
  const [dataSourceTable, setDataSourceTable] = useState(dataSource);
  const [editingKeys, setEditingKeys] = useState([]);

  const isEditing = (record) => {
    return editingKeys.find((item) => item === record.key) ? true : false;
  };

  const triggerOnChange = ({ key, value, name }) => {
    const itemIndex = dataSource.findIndex((data) => data.key === key);
    const copyDataSource = [...dataSourceTable];
    copyDataSource[itemIndex] = {
      ...copyDataSource[itemIndex],
      [name]: value,
    };
    setDataSourceTable(dataSourceTable);
    onChange?.(form.getFieldsValue());
  };

  const checkEditing = (type, record) => {
    if (type === 'multiple') {
      return true;
    } else {
      return record.isNew || isEditing(record);
    }
  };

  useEffect(() => {
    setDataSourceTable(dataSource);
    dataSource?.forEach((data) => {
      if (data.isNew) {
        setEditingKeys([data.key]);
      }
    });
  }, [dataSource]);

  useEffect(() => {
    if (dataSource && type === 'multiple') {
      for (const data of dataSource) {
        form.setFieldsValue({
          [`${data.key}`]: {
            ...data,
            ...covertDataTypeDatePicker(data, columns),
          },
        });
      }
    }
  }, [dataSource]);

  const edit = (record) => {
    form.setFieldsValue({
      [`${record.key}`]: {
        ...record,
        ...covertDataTypeDatePicker(record, columns),
      },
    });
  };

  let columnsTable = '';

  if (isExistActionColumns(columns)) {
    columnsTable = columns;
  } else {
    columnsTable = [
      ...columns,
      {
        title: 'Action',
        dataIndex: 'action',
        style: {
          width: '20%',
        },
        render: (_, record) => {
          const editable = checkEditing(type, record);
          if (type) {
            return (
              <Typography.Link onClick={() => {
                setDataSourceTable(dataSource.filter((data) => data.key !== record.key))
                form.validateFields()
                onCancel(record)
              }}>
                Delete
              </Typography.Link>
            );
          }
          return editable ? (
            <span>
              <Typography.Link
                onClick={async () => {
                  await form.validateFields();
                  setEditingKeys([]);
                  onSave({
                    key: record.key,
                    data: form.getFieldValue(record.key),
                    method: record.isNew ? 'POST' : 'PUT',
                  });
                }}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={async () => {
                  setEditingKeys([]);
                  onCancel(record);
                }}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Space>
                <Typography.Link
                  disabled={editingKeys.length !== 0}
                  onClick={() => {
                    setEditingKeys([record.key]);
                    edit(record);
                  }}
                >
                  Edit
                </Typography.Link>
                <Typography.Link
                  disabled={editingKeys.length !== 0}
                  onClick={() => onDelete(record.key)}
                >
                  Delete
                </Typography.Link>
              </Space>
            </span>
          );
        },
      },
    ];
  }

  const mergeColumns = columnsTable.map((column) => {
    if (!column.editable) {
      return column;
    }
    return {
      ...column,
      onCell: (record) => ({
        record,
        editable: column.editable,
        inputType: column.inputType,
        dataIndex: column.dataIndex,
        title: column.title,
        triggerOnChange: triggerOnChange,
        editing: checkEditing(type, record),
        formItemProps: column.formItemProps,
        elementProps: column.elementProps,
      }),
    };
  });

  const addNewRow = () => {

  }

  return (
    <>
      <Form form={form}>
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
        />
      </Form>
      <AddNewRowButton addNewRow={addNewRow} title={'Add new customer'}/>
    </>
  );
};

export default EditTable;
