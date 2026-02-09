import { useAtomValue } from "jotai";
import { clickedLocationAtom, locationsAtom, transportTasksAtom } from "../store";
import { AnimatedArrow } from "./AnimatedArrow";
import type { LocationMapElementModel } from "../types/location";

export function TaskArrowManager() {
    const tasks = useAtomValue(transportTasksAtom);
    const locations = useAtomValue(locationsAtom);
    const clickedLocation = useAtomValue(clickedLocationAtom);

    if (!clickedLocation) {
        return null;
    }

    const activeTasks = tasks.filter(x => x.startLocationCode === clickedLocation || x.endLocationCode === clickedLocation);
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