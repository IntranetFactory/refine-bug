import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
  getDefaultSortOrder,
  FilterDropdown,
} from "@refinedev/antd";
import { useMany, type BaseRecord, getDefaultFilter, } from "@refinedev/core";
import { Space, Table, Input } from "antd";
import { useParams, useLocation } from 'react-router-dom';

export const BlogPostFilteredList = () => {

  const location = useLocation();

  return <BlogPostFilteredListIntern key={location.pathname} />;
};

const BlogPostFilteredListIntern = () => {

  const location = useLocation();
  console.log(location);

  const { tableProps, sorters, filters } = useTable({
    syncWithLocation: true,
    sorters: {
      initial: [{ field: "created_at", order: "asc" }],
    },
    filters: {
      permanent: [{ field: "status", operator: "eq", value: "published" }],
    }
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useMany({
    resource: "categories",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.category?.id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          dataIndex="content"
          title={"Content"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        />
        <Table.Column
          dataIndex={"category"}
          title={"Category"}
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              categoryData?.data?.find((item) => item.id === value?.id)?.title
            )
          }
        />

        <Table.Column
          title={"Stat us"}
          dataIndex="status"
          sorter={true}
          defaultSortOrder={getDefaultSortOrder("status", sorters)}
        />

        <Table.Column
          sorter
          defaultSortOrder={getDefaultSortOrder("created_at", sorters)}
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
