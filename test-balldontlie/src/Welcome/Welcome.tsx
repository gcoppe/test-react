import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type Nullable<T> = T | null;

export interface Players {
    data?: Nullable<Player[]>;
    meta: Meta;
  }
  export interface Player {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    height_feet: number;
    height_inches: number;
    weight_pounds: number;
    team: Team;
  }
  export interface Team {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
  }
  export interface Meta {
    total_pages: number;
    current_page: number;
    next_page: number;
    per_page: number;
    total_count: number;
  }


// const Player= ({player}) => {
//     //  ID, first name, position, team name
//     return (
//         <li key={player.id}>{player?.id} {player?.first_name} {player?.position} {player?.team?.name}</li>
//     )
// }

// const Players = ({players}) => {
//     return (
//         <ul>
//             {players.map((player:Player) =>
//                 <Player player={player}></Player>
//             )
//             }
//         </ul>
//     )
// }
function getPlayers(): Promise<Players>{
    return  fetch('/api/players?per_page=100').then((response) =>
        {
            return  response.json();
        });
}


export const PlayerDetails = () => {

    const { id } = useParams();

    console.log(id);

    const [player, setPlayer] = useState<Player>();

    useEffect(() => {
        fetch(`/api/players/${id}`)
        .then((response)=>response.json())
        .then((player: Player) => {
            console.log(player);
            setPlayer(player);
        })
    }, []);

    return (
        <ul>
            {/* <li>{JSON.stringify(player)}</li> */}
            <li>{player?.id}</li>
            <li>{player?.first_name} {player?.last_name}</li>
            <li>{player?.team.full_name}</li>
        </ul>
    )

}



const Welcome = () => {


    const [players, setPlayers] = useState<Players>();

    const [dataSource, setDataSource] = useState<any>();
    const columns = [
        { title: 'id', dataIndex: 'id', key: 'id', render: (value) => {
            return (
              <a
                onClick={(event) => event.stopPropagation()}
                href={'/player/' + value}
              >
                {value}
              </a>
            );
            }
        },
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Position', dataIndex:'position', key: 'position' },
        { title: 'Team', dataIndex: 'team', key: 'team' },
    ];

    useEffect(() => {
        getPlayers().then((response: Players) => {
            if (response?.data) {
                const players = response.data.map((p) => ({id: p.id, first_name: p.first_name, position: p.position, team: p.team.name}));
                console.log(players, columns);
                    setDataSource(players);
                }

        })
    }, []);

    return (
        <div style={{background: 'white'}}>
        {dataSource &&
            <Table
            rowKey={(record) => record.id}
            onRow={(record) => ({
                onClick: (e) => {
                    // redirect to player's details page
                    window.location.href = `/player/${record.id}`;
                  },
                })}
            dataSource={dataSource}
            columns={columns}>
            </Table>
        }
        </div>
    )
}

export default Welcome;