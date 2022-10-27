/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
 import React, { useEffect, useState } from 'react';
 import CircularProgress from '@mui/material/CircularProgress';
 import { PaginationTable, TColumn } from '../components/PaginationTable';
 import { useData } from '../util/api';
 import { useAppSelector } from '../util/redux/hooks';
 import { selectOrder } from '../util/redux/userSlice'; //need to create orderSlice somewhere
 import IOrder from '../util/types/order';
 
 interface PartnerOrderTableRow {
   pickupDate: string;
   pickupTime: string;
   status: string;
   produce: number;
   meat: number;
   dry: number;
   vito: number;
   retail: number;
   view: React.ReactElement;
 }
 
 /**
  * The standalone table component for holding information about the orders in
  * the database and allowing organizations to view orders themselves.
  */
 function PartnerOrderTable() {
   // define columns for the table
   const columns: TColumn[] = [
     { id: 'pickupDate', label: 'Pick-up Date' },
     { id: 'pickupTime', label: 'Pick-up Time' },
     { id: 'status', label: 'Status' },
     { id: 'produce', label: 'Produce' },
     { id: 'meat', label: 'Meat' },
     { id: 'dry', label: 'Dry' },
     { id: 'vito', label: 'Vito' },
     { id: 'retail', label: 'RR' },
     { id: 'view', label: '' },
   ];
 
   // Used to create the data type to create a row in the table
   function createPartnerOrderTableRow(
     order: IOrder,
     view: React.ReactElement,
   ): PartnerOrderTableRow {
     const { pickup, status, produce, meat, dry, vito, retailRescue } = order;
     return {
       pickupDate: pickup.toLocaleDateString(),
       pickupTime: pickup.toLocaleTimeString(),
       status: status,
       produce: produce.count,
       meat: meat.count,
       dry: dry.count,
       vito: vito.count,
       retail: retailRescue.length,
       view,
     };
   }
 
   const [orderList, setOrderList] = useState<IOrder[]>([]);
   const order = useData('admin/all');
   const self = useAppSelector(selectOrder);
   
 

   //need to create the viewOrderButton as well
   // if the orderlist is not yet populated, display a loading spinner
   if (!orderList) {
     return (
       <div style={{ width: '0', margin: 'auto' }}>
         <CircularProgress size={80} />
       </div>
     );
   }
   return (
     <PaginationTable
       rows={orderList.map((user: IOrder) =>
         createPartnerOrderTableRow(
           order,
           <ViewOrderButton 
           />,
         ),
       )}
       columns={columns}
     />
   );
 }
 
 export default PartnerOrderTable;
 