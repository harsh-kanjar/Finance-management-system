import React from 'react'
import {
    LendDashboard,
} from "../components";
import { useAppContext } from "../context/AppContext";

function LendAnalysis() {
    const { balanceData} = useAppContext();

    return (
        <div>
            <LendDashboard data={balanceData} />
        </div>
    )
}

export default LendAnalysis
