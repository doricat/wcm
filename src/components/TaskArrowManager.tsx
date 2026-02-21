import { useAtomValue } from "jotai";
import { selectedTasksAtom, mapLocationsAtom, transportTasksAtom } from "../store";
import { AnimatedArrow } from "./AnimatedArrow";
import type { LocationMapElementModel } from "../types/location";
import type { TransportTaskMapModel } from "../types/transportTask";

export function TaskArrowManager() {
    const tasks = useAtomValue(transportTasksAtom);
    const locations = useAtomValue(mapLocationsAtom);
    const atom = useAtomValue(selectedTasksAtom);

    if (!atom) {
        return null;
    }

    let activeTasks: TransportTaskMapModel[] = [];
    if (atom.taskCode) {
        activeTasks = tasks.filter(x => x.code === atom.taskCode);
    } else if (atom.locationCode) {
        activeTasks = tasks.filter(x => x.startLocationCode === atom.locationCode || x.endLocationCode === atom.locationCode);
    }

    if (activeTasks.length === 0) {
        return null;
    }

    const arrows = [];
    for (const task of activeTasks) {
        let source: LocationMapElementModel | undefined;
        let target: LocationMapElementModel | undefined;

        if (task.startLocationCode) {
            source = locations.find(x => x.code === task.startLocationCode);
        }

        if (task.endLocationCode) {
            target = locations.find(x => x.code === task.endLocationCode);
        }

        if (source && target) {
            arrows.push(<AnimatedArrow key={task.code} source={source} target={target} />);
        } else if (source) {
            arrows.push(<AnimatedArrow key={task.code} source={source} target={source} />)
        }
    }

    return (
        <>
            {arrows}
        </>
    );
}