import React, { useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Table } from "antd";

const intialData = [
  {
    key: "1",
    name: "John Brown"
  },
  {
    key: "2",
    name: "3123 123"
  }
];

const Example = () => {
    const [data, setData] = useState(intialData);

    const onChange = (e, index) => {
        const newData = [...data];
        const newItem = { ...newData[index] };
        newItem.name = e.target.value;
        newData[index] = newItem;
        setData(newData);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, _, index) => <input value={text} onChange={(v) => onChange(v, index)} />,
            shouldCellUpdate: (record, prevRecord) => {
                console.log(record.name, prevRecord.name);
                return record.name !== prevRecord.name;
            }
        }
    ];
    return <Table columns={columns} dataSource={data} />;
};

export default Example
