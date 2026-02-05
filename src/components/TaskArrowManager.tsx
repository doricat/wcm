import { useAtomValue } from "jotai";
import { locationsAtom, transportTasksAtom } from "../store";
import { AnimatedArrow } from "./AnimatedArrow";
import type { LocationMapElementModel } from "../types/location";
import { transportTaskStatuses } from "../types/enums";

interface Props {
    locationCode: string | null;
}

export function TaskArrowManager(props: Props) {
    const tasks = useAtomValue(transportTasksAtom);
    const locations = useAtomValue(locationsAtom);

    if (!props.locationCode) {
        return null;
    }

    const activeTasks = tasks.filter(x => (x.startLocationCode === props.locationCode || x.endLocationCode === props.locationCode) && x.status >= transportTaskStatuses.pending && x.status <= transportTaskStatuses.renewable);
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