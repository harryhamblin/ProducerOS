import { ColumnDefinition } from "./projects";

export const BidColumns: ColumnDefinition[] = [

{
    field: "name",
    title: "Bid",
    editable: true,
    type: "text",
},

{
    field: "version",
    title: "Version",
    editable: true,
    type: "number",
},

{
    field: "status",
    title: "Status",
    editable: true,
    type: "select",
},

{
    field: "currency",
    title: "Currency",
    editable: true,
    type: "text",
},

{
    field: "labourCost",
    title: "Labour",
    editable: false,
    align: "right",
},

{
    field: "foreignSpend",
    title: "Foreign",
    editable: false,
    align: "right",
},

{
    field: "grandTotal",
    title: "Total",
    editable: false,
    align: "right",
},

];