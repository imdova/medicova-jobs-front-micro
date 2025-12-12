// import { North, South } from "@mui/icons-material";

// const StatusCard: React.FC<{ card: StatusCardType }> = ({ card }) => {
//   return (
//     <div className="flex items-center justify-between gap-3 rounded-base border border-gray-200 bg-white p-4 shadow-soft">
//       <div>
//         <span className="mb-2 block text-nowrap text-sm text-muted-foreground">
//           {card.label}
//         </span>
//         <h2 className="mb-2 text-lg font-bold">{card.number}</h2>
//         <span
//           className={`flex items-center text-xs ${
//             card.type === "increase" ? "text-primary" : "text-[#F81D1D]"
//           }`}
//         >
//           {card.type === "increase" ? (
//             <North className="text-xs" />
//           ) : (
//             <South className="text-xs" />
//           )}
//           {card.change}
//         </span>
//       </div>
//       {card.icon}
//     </div>
//   );
// };

// export default StatusCard