import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import React from "react"
import { useEffect, useState} from "react";
import Select from 'react-select';
import useArticlesContext from "../hooks/use-articles-context";
import "../styles/Modal.css"

 const GET_TEAMS = gql`
    query {
        teams {
            name
            id
        }
        leagues {
            name
            id
        }

    }
 `;

// Helper function to convert data into React-Select required array of objects with keys of value and label
const mapArrayOfObjects = (dataArray) => {
    return dataArray.map((data) => ({
        value: data.id,
        label: data.name
    }));
};

function Modal({onClose}) {
    const { 
        resetPage, 
        selectedTeams, 
        selectedLeagues, 
        setSelectedTeams, 
        setSelectedLeagues,  
        updateArticleIdArray 
    } = useArticlesContext();

    const { data, loading } = useQuery(GET_TEAMS);

    const [teamsArrayOfObjects, setTeamsArrayOfObjects] = useState([]);
    const [leaguesArrayOfObjects, setLeaguesArrayOfObjects] = useState([]);

    useEffect(() => {
        if (!loading && data) {
          setTeamsArrayOfObjects(mapArrayOfObjects(data.teams));
          setLeaguesArrayOfObjects(mapArrayOfObjects(data.leagues));
        }
      }, [loading, data]);

    const handleSubmit = (event) => {
        event.preventDefault()
        const teamsIdArray = selectedTeams.map((team) => team.value)
        const leaguesIdArray = selectedLeagues.map((league) => league.value)
        const articleIdArray = [...teamsIdArray, ...leaguesIdArray]
        updateArticleIdArray(articleIdArray)
        resetPage()
        onClose()
    }

    const handleRemoveTeam = (event) => {
        const teamId = event.target.getAttribute('id')
        const newTeamArray = selectedTeams.filter((team) => team.value !== teamId)
        setSelectedTeams(newTeamArray)
    }

    const handleRemoveLeague = (event) => {
        const leagueId = event.target.getAttribute('id')
        const newLeagueArray = selectedLeagues.filter((league) => league.value !== leagueId)
        setSelectedLeagues(newLeagueArray)
    }

    return (
        <div className='Modal'>
            <div className='Modal-container'>
                    { loading ? (
                        <p>Loading</p>
                    ) : ( 
                        <>  
                            <div className='Modal-select-container'>
                                <form onSubmit={handleSubmit}>
                                <h1>Select Your Favorite Teams and Leagues</h1>
                                <div className='Modal-button-close' onClick={onClose}>close</div>

                                    <div className='Modal-select'>
                                        <Select value={selectedTeams} placeholder="Teams" onChange={(event) => setSelectedTeams(event)} closeMenuOnSelect={false} isMulti options={teamsArrayOfObjects}/>
                                    </div> 
                                    <div className='Modal-select'>
                                        <Select value={selectedLeagues} placeholder="Leagues" onChange={(event) => setSelectedLeagues(event)} closeMenuOnSelect={false} isMulti options={leaguesArrayOfObjects}/>
                                    </div>
                                    <div  className='Modal-select'>
                                        <button className='Modal-button'>Save</button>
                                    </div>
                                    <div className='Modal-list-container'>
                                        {selectedTeams.length > 0 && 
                                            <ul className='Modal-list'>
                                                Favorite Teams {selectedTeams.map((team) => (
                                                    <li key={team.value} id={team.value} onClick={handleRemoveTeam}>{team.label}</li>)
                                                )}
                                            </ul>
                                        }
                                        {selectedLeagues.length > 0 &&
                                        <ul className='Modal-list'>
                                            Favorite Leagues {selectedLeagues.map((league) => (
                                                <li key={league.value} id={league.value} onClick={handleRemoveLeague}>{league.label}</li>)
                                            )}
                                        </ul>
                                        }
                                    </div>
                                </form>
                            </div>
                        </>

                    )}
            </div>
        </div>
    )
}

export default Modal
