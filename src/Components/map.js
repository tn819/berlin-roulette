import React from "react";
import * as PigeonMap from "pigeon-maps";
import Overlay from "pigeon-overlay";
import { connect } from "react-redux";

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [52.52, 13.405]
        };
    }

    render() {
        console.log("map props/state", this.state, this.props);
        let { center } = this.state;
        let overlayCenter = center;
        if (this.props.station !== undefined) {
            overlayCenter = [
                this.props.station.location.latitude,
                this.props.station.location.longitude
            ];
            center = [
                this.props.station.location.latitude,
                this.props.station.location.longitude
            ];
        }
        console.log("new map rendering", overlayCenter, center);
        return (
            <PigeonMap
                center={center || this.state.center}
                width={500}
                height={400}
                zoom={15}
            >
                <Overlay anchor={[overlayCenter[0], overlayCenter[1]]}>
                    <img
                        className="mapOverlay"
                        src={this.props.icon}
                        width={80}
                        height={80}
                        alt=""
                    />
                </Overlay>
            </PigeonMap>
        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state);
    return {
        station: state.station
    };
};

export default connect(mapStateToProps)(Map);
