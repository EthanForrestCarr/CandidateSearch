import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const query = 'developer';
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const data = await searchGithub(query, page);
      setCandidates((prev) => [...prev, ...data]);
      setLoading(false);
    };
    fetchCandidates();
  }, [page]);
  useEffect(() => {
    
    if (candidates.length > 0 && currentIndex < candidates.length) {
      const fetchCandidateDetails = async () => {
        setLoading(true);
        const candidateData = await searchGithubUser(candidates[currentIndex].login);

       
        if (
          candidateData.name &&
          candidateData.email &&
          candidateData.location &&
          candidateData.company
        ) {
          setCurrentCandidate(candidateData);
        } else {
          showNextCandidate();
        }
        setLoading(false);
      };
      fetchCandidateDetails();
    } else if (currentIndex >= candidates.length) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [currentIndex, candidates]);

  const saveCandidate = () => {
    if (currentCandidate) {
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      savedCandidates.push(currentCandidate);
      localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    }
    showNextCandidate();
  };

  const showNextCandidate = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) return <p>Loading candidate...</p>;
  if (!candidates.length) return <p>Loading candidates...</p>;
  if (!currentCandidate) return <p>No more candidates to review.</p>;

  return (
    <div className='container'>
      <h1>Candidate Search</h1>
      <ul className='card'>
        <img src={currentCandidate.avatar_url} alt={`${currentCandidate.login}'s avatar`} />
        <div className='card-content'>
          <h2>{currentCandidate.name}</h2>
          <p>Username: {currentCandidate.login}</p>
          <p>Location: {currentCandidate.location}</p>
          <p>Email: {currentCandidate.email}</p>
          <p>Company: {currentCandidate.company}</p>
          <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">GitHub Profile</a>
          <div>
            <button className='add' onClick={saveCandidate}>+</button>
            <button className='nah' onClick={showNextCandidate}>-</button>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default CandidateSearch;
