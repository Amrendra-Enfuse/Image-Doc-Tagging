import { FolderOutlined } from "@ant-design/icons";

export const userColumns = [

    {
        title: "Project Name",
        dataIndex: "projectName",
        key: "projectName",
        // render: (text, record) => (
        //     <span>
        //         <FolderOutlined style={{ marginRight: '8px' }} /> {text}
        //     </span>
        // ),
    },
    {
        title: "Folder Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <span>
                <FolderOutlined style={{ marginRight: '8px' }} /> {text}
            </span>
        ),
    },
    {
        title: "Images",
        dataIndex: "numOfImages",
        key: "numOfImages",
        width: 100
    },
    {
        title: "Annotations",
        dataIndex: "numOfAnnotations",
        key: "numOfAnnotations",
        width: 100

    },
    // {
    //   title: "Address",
    //   key: "address",
    //   render: record => {
    //     return Object.values(record.address)
    //       .filter(val => typeof val !== "object")
    //       .join(" ");
    //   }
    // },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        //   render: (text, record) => {
        //         <span>{text}</span>
        //     },
    },
    // {
    //   title: "Website",
    //   dataIndex: "website",
    //   key: "website"
    // }
];