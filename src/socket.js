import { io } from "socket.io-client";
import { ref } from "vue";

const socketState = {
  socketIsConnected: ref(false),
};

export const socket = io("http://localhost:3000");

const _connectToSocket = async () => {
  try {
    await socket.connect();
    socketState.socketIsConnected.value = true;
  } catch (error) {
    socketState.socketIsConnected.value = false;
    setTimeout(() => {
      _connectToSocket();
    }, 1000);
  }

  socket.on("disconnect", () => {
    socketState.socketIsConnected.value = false;
    setTimeout(() => {
      _connectToSocket();
    }, 1000);
  });
};

export const useSocketIo = () => {
  const listenToEvent = async (event, Func) => {
    if (socket.connected) {
      socket.on(event, Func);
    } else {
      await _connectToSocket();
      socket.on(event, Func);
    }
  };

  return { listenToEvent, _connectToSocket };
};

// import { useSocketIo } from '@/api_factory/socket.config'
// import { loadMarkeronMap } from '@/composables/core/map/tracking'
// import { useGetActiveTripsList } from '@/composables/modules/trips/fetch/activeTrips'

// type PassagerType = {
// 	position_latitude: number;
// 	position_longitude: number;
//     position_direction: number;
//     device_recorded_at: string;
// 	driver_id: number;

// };

// export const useTripTracking = () => {
// 	const { activeTripsList } = useGetActiveTripsList()
// 	const { listenToEvent, _connectToSocket } = useSocketIo()
// 	_connectToSocket()

// 	const listenToSpecificTripLocationAndAddtoMap = (
// 		tripId: string, clickFunc:(data:any)=>void
//     ) => {
// 		listenToEvent(`trips:${tripId}`, (data: PassagerType) => {
// 			activeTripsList.value.filter((i) => i.id === tripId)[0].vehicle_status = true
// 			activeTripsList.value.filter((i) => i.id === tripId)[0].lat = data.position_latitude
// 			activeTripsList.value.filter((i) => i.id === tripId)[0].lng = data.position_longitude
//             loadMarkeronMap({
//                 id: data.driver_id,
//                 lat: data.position_latitude,
//                 lng: data.position_longitude
//             }, clickFunc, '/bus.svg', data.position_direction)
// 		})
// 	}

// 	return { listenToSpecificTripLocationAndAddtoMap }
// }
