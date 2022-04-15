import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Popconfirm,
  Typography,
  Space,
  DatePicker,
  message,
} from 'antd';
import EditableCell from './EditTableCell';
import AddNewRowButton from '../../common/table/button/AddNewRowButton';
import moment from 'moment';
import { FormatDate_DD_MM_YYY } from '../../format/date/FormatDate';

const convertData = (data, columns) => {
  const outputData = { ...data };
  for (const column of columns) {
    if (column.inputType === DatePicker) {
      return {
        ...outputData,
        [`${column.dataIndex}`]: moment(outputData[column.dataIndex]).format(
          FormatDate_DD_MM_YYY
        ),
      };
    }
  }
  return outputData;
};

const convertDataFormSetFieldSValue = (data, columns) => {
  const outputData = { ...data };
  for (const column of columns) {
    if (column.inputType === DatePicker) {
      return {
        ...outputData,
        [`${column.dataIndex}`]: moment(
          outputData[column.dataIndex],
          FormatDate_DD_MM_YYY
        ),
      };
    }
  }
  return outputData;
};

const isExistNewRow = (data) => {
  return data.filter((item) => item?.isNew).length !== 0 ? true : false;
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
    showAddNewRow = true,
    useDefaultActionColumn = true,
    ...restProps
  } = props;

  const [formEditTale] = Form.useForm();
  const [dataSourceTable, setDataSourceTable] = useState(dataSource);
  const [editingKeys, setEditingKeys] = useState([]);
  const form = formOutside || formEditTale;

  useEffect(() => {
    setDataSourceTable(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (dataSource && type === 'multiple') {
      for (const data of dataSource) {
        form.setFieldsValue({
          [`${data.key}`]: {
            ...data,
            ...convertDataFormSetFieldSValue(data, columns),
          },
        });
      }
    }
  }, [dataSource]);

  const isEditing = (record) => {
    if (type === 'multiple') {
      return true;
    }
    return editingKeys.find((key) => key === record.key) ? true : false;
  };

  const triggerOnChange = (recordKey) => {
    const data = form.getFieldValue(recordKey);
    const dataIndex = dataSourceTable.findIndex(
      (data) => data.key === recordKey
    );
    const newDataSource = [...dataSourceTable];
    newDataSource[dataIndex] = {
      ...newDataSource[dataIndex],
      ...convertData(data, columns),
    };
    setDataSourceTable(newDataSource);
    onChange?.(form.getFieldsValue());
  };

  const cancel = (record) => {
    if (record.isNew) {
      setDataSourceTable(
        [...dataSourceTable].filter((item) => item.key !== record.key)
      );
    }
    setEditingKeys([...editingKeys].filter((key) => key !== record.key));
  };

  const edit = (record) => {
    setEditingKeys([...editingKeys, record.key]);
    form.setFieldsValue({
      [`${record.key}`]: {
        ...record,
        ...convertDataFormSetFieldSValue(record, columns),
      },
    });
  };

  const save = (record) => {
    const { isNew, ...restRecord } = record;
    onSave({ isNew, data: restRecord });
    setEditingKeys([]);
  };

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
              onClick={() => {
                setDataSourceTable(
                  dataSource.filter((data) => data.key !== record.key)
                );
                cancel(record);
              }}
            >
              Delete
            </Typography.Link>
          );
        }
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
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

  const addNewRow = () => {
    if (!type && isExistNewRow(dataSourceTable)) {
      message.warn('Please complete add current row');
      return;
    }
    const key = Date.now();
    let newData = {
      key: key,
      isNew: true,
    };
    for (const column of columns) {
      newData[`${column.dataIndex}`] = column.formItemProps?.initialValue;
    }
    setDataSourceTable([...dataSourceTable, { ...newData }]);
    setEditingKeys([...editingKeys, key]);
  };

  let columnsTable = columnsDefault;
  if (!useDefaultActionColumn) {
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
      {showAddNewRow && (
        <AddNewRowButton addNewRow={addNewRow} title={'Add new row'} />
      )}
    </>
  );
};

export default EditTable;
