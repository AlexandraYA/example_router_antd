import { Table } from 'antd';

const columns = [
  {
    title: 'Клиент',
    dataIndex: 'client',
    width: 300,
  },
  {
    title: 'Дата поставок',
    dataIndex: 'date',
    width: 200,
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    width: 300,
  },
  {
    title: 'Масса',
    dataIndex: 'massa',
    width: 200,
  },
];

const dataSource = [
  {
    client: 'Клиент 1',
    date: '30.09.2025',
    status: 'ожидается',
    massa: '340кг',
  },
  {
    client: 'Клиент 2',
    date: '30.09.2025',
    status: 'ожидается',
    massa: '340кг',
  },
  {
    client: 'Клиент 3',
    date: '30.09.2025',
    status: 'ожидается',
    massa: '340кг',
  },
  {
    client: 'Клиент 4',
    date: '30.09.2025',
    status: 'ожидается',
    massa: '340кг',
  },
];

const Customers = () => {

  return (
    <div>
      <Table
      columns={columns}
      dataSource={dataSource}
      />
    </div>
  )
}

export { Customers }
