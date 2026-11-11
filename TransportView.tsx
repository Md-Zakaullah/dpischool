import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation,
  Fuel,
  Users,
  Compass
} from 'lucide-react';

interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  busRegNo: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  conductorPhone: string;
  capacity: number;
  studentsCount: number;
  morningPickupStart: string;
  afternoonDrop: string;
  status: 'On Route' | 'Arrived at School' | 'In Depot' | 'Maintenance';
  stops: { stopName: string; time: string }[];
  gpsLatLong: string;
  speed: string;
}

const INITIAL_ROUTES: BusRoute[] = [
  {
    id: 'rt-14',
    routeNumber: 'Route 14',
    routeName: 'Vasant Vihar – Vasant Kunj – Munirka – IIT Flyover',
    busRegNo: 'DL-1PD-4890',
    driverName: 'Sh. Ramesh Chand (Badge: 1042)',
    driverPhone: '+91 98119 23401',
    conductorName: 'Suraj Kumar',
    conductorPhone: '+91 98119 23402',
    capacity: 45,
    studentsCount: 42,
    morningPickupStart: '06:40 AM',
    afternoonDrop: '02:35 PM',
    status: 'On Route',
    speed: '34 km/h (Govt. Limit 40)',
    gpsLatLong: '28.5535° N, 77.1649° E (Munirka Flyover)',
    stops: [
      { stopName: 'B-Block Market, Vasant Vihar', time: '06:40 AM' },
      { stopName: 'Pocket C, Vasant Kunj (DPS Roundabout)', time: '06:55 AM' },
      { stopName: 'Munirka DDA Flats Gate 2', time: '07:10 AM' },
      { stopName: 'IIT Delhi Gate / Ber Sarai', time: '07:25 AM' },
      { stopName: 'DPIA School Campus Gate 1', time: '07:45 AM' }
    ]
  },
  {
    id: 'rt-07',
    routeNumber: 'Route 07',
    routeName: 'Golf Links – Khan Market – Defence Colony – Lodhi Estate',
    busRegNo: 'DL-1PD-3120',
    driverName: 'Sh. Kuldeep Singh (Badge: 0891)',
    driverPhone: '+91 98119 23403',
    conductorName: 'Manoj Prasad',
    conductorPhone: '+91 98119 23404',
    capacity: 45,
    studentsCount: 38,
    morningPickupStart: '06:45 AM',
    afternoonDrop: '02:30 PM',
    status: 'Arrived at School',
    speed: '0 km/h (Parked Gate 2)',
    gpsLatLong: '28.5284° N, 77.2185° E (Pushp Vihar Campus)',
    stops: [
      { stopName: 'Golf Links Main Gate', time: '06:45 AM' },
      { stopName: 'Khan Market Metro Exit 2', time: '07:00 AM' },
      { stopName: 'Defence Colony Flying Club Road', time: '07:15 AM' },
      { stopName: 'Moolchand Metro Station', time: '07:25 AM' },
      { stopName: 'DPIA School Campus Gate 2', time: '07:42 AM' }
    ]
  },
  {
    id: 'rt-03',
    routeNumber: 'Route 03',
    routeName: 'Rohini Sector 9 – Pitampura – Shalimar Bagh',
    busRegNo: 'DL-1PD-5511',
    driverName: 'Sh. Balwan Tomar (Badge: 1102)',
    driverPhone: '+91 98119 23405',
    conductorName: 'Ram Avatar',
    conductorPhone: '+91 98119 23406',
    capacity: 48,
    studentsCount: 45,
    morningPickupStart: '06:15 AM',
    afternoonDrop: '03:10 PM',
    status: 'In Depot',
    speed: '0 km/h (Inspection Bay)',
    gpsLatLong: '28.5290° N, 77.2190° E (North Depot)',
    stops: [
      { stopName: 'DC Chowk, Rohini Sec 9', time: '06:15 AM' },
      { stopName: 'Madhuban Chowk, Pitampura', time: '06:30 AM' },
      { stopName: 'Shalimar Bagh Club Road', time: '06:45 AM' },
      { stopName: 'Ring Road Dhaula Kuan', time: '07:15 AM' },
      { stopName: 'DPIA School Campus Gate 1', time: '07:45 AM' }
    ]
  },
  {
    id: 'rt-11',
    routeNumber: 'Route 11',
    routeName: 'Noida Sec 15/18 – Mayur Vihar Phase 1 – Akshardham',
    busRegNo: 'DL-1PD-8820',
    driverName: 'Sh. Sunil Rawat (Badge: 0945)',
    driverPhone: '+91 98119 23407',
    conductorName: 'Dinesh Sharma',
    conductorPhone: '+91 98119 23408',
    capacity: 45,
    studentsCount: 40,
    morningPickupStart: '06:30 AM',
    afternoonDrop: '02:45 PM',
    status: 'On Route',
    speed: '38 km/h (Govt. Limit 40)',
    gpsLatLong: '28.5721° N, 77.2890° E (Sarai Kale Khan)',
    stops: [
      { stopName: 'Noida Sector 15 Metro', time: '06:30 AM' },
      { stopName: 'Mayur Vihar Phase 1 Pocket 1', time: '06:45 AM' },
      { stopName: 'Akshardham Setu Link', time: '07:05 AM' },
      { stopName: 'Ashram Flyover / Ring Road', time: '07:20 AM' },
      { stopName: 'DPIA School Campus Gate 1', time: '07:45 AM' }
    ]
  },
  {
    id: 'rt-09',
    routeNumber: 'Route 09',
    routeName: 'Dwarka Sector 6 – Sector 10 – Janakpuri District Center',
    busRegNo: 'DL-1PD-9014',
    driverName: 'Sh. Harish Verma (Badge: 1021)',
    driverPhone: '+91 98119 23409',
    conductorName: 'Mahesh Negi',
    conductorPhone: '+91 98119 23410',
    capacity: 45,
    studentsCount: 44,
    morningPickupStart: '06:25 AM',
    afternoonDrop: '03:00 PM',
    status: 'Arrived at School',
    speed: '0 km/h (Parked Gate 1)',
    gpsLatLong: '28.5284° N, 77.2185° E (Pushp Vihar Campus)',
    stops: [
      { stopName: 'Dwarka Sec 6 Market', time: '06:25 AM' },
      { stopName: 'Dwarka Sec 10 Metro Station', time: '06:40 AM' },
      { stopName: 'Janakpuri District Center', time: '07:00 AM' },
      { stopName: 'Delhi Cantt Flyover', time: '07:20 AM' },
      { stopName: 'DPIA School Campus Gate 1', time: '07:44 AM' }
    ]
  }
];

export const TransportView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(INITIAL_ROUTES[0].id);
  const [sosSent, setSosSent] = useState(false);

  const filteredRoutes = INITIAL_ROUTES.filter(r => 
    r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.busRegNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRoute = INITIAL_ROUTES.find(r => r.id === selectedRouteId) || INITIAL_ROUTES[0];

  const handleSosTrigger = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>School Bus Transport & GPS Fleet Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-medium">
              Delhi Govt. Safe School Bus Certified
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Delhi Public International Academy · 18 AC School Buses · GPS & Speed Governors (40 km/h) Active
          </p>
        </div>

        <button
          onClick={handleSosTrigger}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Transport Helpline SOS</span>
        </button>
      </div>

      {sosSent && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Emergency SOS alert broadcasted to DPIA Transport Desk & Delhi Police Control Room.</span>
          </div>
          <span className="font-mono text-[11px] font-bold">Helpline: +91 11 2956 8910</span>
        </div>
      )}

      {/* 4 Fleet Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Bus Fleet</span>
            <Bus className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 block">
            18 Buses
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Fitness & PUC Verified</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Students Commuting</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 block">
            1,240 Scholars
          </span>
          <span className="text-[11px] text-slate-500">Across 22 Delhi-NCR Routes</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>GPS Tracking Signal</span>
            <Navigation className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 block">
            Live 100%
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">CCTV & Panic Buttons Active</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>On-Time Arrival Rate</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 block">
            99.2%
          </span>
          <span className="text-[11px] text-slate-500">Morning Reporting by 07:45 AM</span>
        </div>
      </div>

      {/* Main Grid: Routes List & Selected Route Live Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Routes List & Search */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route number, driver or area..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredRoutes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-colors space-y-1.5 ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 shadow-2xs'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                      {route.routeNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      route.status === 'On Route'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 animate-pulse'
                        : route.status === 'Arrived at School'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] leading-tight line-clamp-1">
                    {route.routeName}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-mono">{route.busRegNo}</span>
                    <span>{route.studentsCount} / {route.capacity} Seats</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Route Live Telemetry & Stop Timetable */}
        <div className="lg:col-span-2 space-y-4">
          {/* Telemetry Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedRoute.routeNumber}: {selectedRoute.routeName}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vehicle No: <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedRoute.busRegNo}</strong> (Tata Starbus AC 45 Seater)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg font-mono text-xs font-semibold">
                  {selectedRoute.speed}
                </span>
              </div>
            </div>

            {/* Crew Contacts & GPS Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Driver Details</span>
                <span className="font-semibold text-slate-900 dark:text-white block">{selectedRoute.driverName}</span>
                <a href={`tel:${selectedRoute.driverPhone}`} className="text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" />
                  <span>{selectedRoute.driverPhone}</span>
                </a>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Conductor Details</span>
                <span className="font-semibold text-slate-900 dark:text-white block">{selectedRoute.conductorName}</span>
                <a href={`tel:${selectedRoute.conductorPhone}`} className="text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" />
                  <span>{selectedRoute.conductorPhone}</span>
                </a>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Live GPS Telemetry</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                  {selectedRoute.gpsLatLong}
                </span>
                <span className="text-[10px] text-slate-500">Updated 5 seconds ago</span>
              </div>
            </div>

            {/* Route Stops & Morning Pickup Schedule */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>Morning Pickup Stops & Estimated Arrival Schedule</span>
              </h4>

              <div className="relative border-l-2 border-indigo-300 dark:border-indigo-800 ml-3 pl-4 space-y-4 text-xs">
                {selectedRoute.stops.map((stop, i) => (
                  <div key={i} className="relative">
                    {/* Bullet */}
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900"></div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {stop.stopName}
                      </span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {stop.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Compliance Badge */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Supreme Court of India Guidelines for School Buses (Speed Governor & First Aid Box)</span>
              </span>
              <span className="font-mono font-semibold">Delhi Transport Dept. Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
