import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const data = await searchGithub(); // fetches candidate list from API
      setCandidates(data);
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (candidates.length > 0 && currentIndex < candidates.length) {
      const fetchCandidateDetails = async () => {
        setLoading(true);
        const candidateData = await searchGithubUser(candidates[currentIndex].username);
        setCurrentCandidate(candidateData);
        setLoading(false);
      };
      fetchCandidateDetails();
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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % candidates.length);
  };

  if (loading) return <p>Loading candidate...</p>;
  if (!candidates.length) return <p>Loading candidates...</p>;
  if (!currentCandidate) return <p>No more candidates to review.</p>;

  return (
    <div>
      <h1>Candidate Search</h1>
      <div>
        <img src={currentCandidate.avatar} alt={`${currentCandidate.username}'s avatar`} width={100} />
        <h2>{currentCandidate.name}</h2>
        <p>Username: {currentCandidate.username}</p>
        <p>Location: {currentCandidate.location || 'N/A'}</p>
        <p>Email: {currentCandidate.email || 'N/A'}</p>
        <p>Company: {currentCandidate.company || 'N/A'}</p>
        <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">GitHub Profile</a>
      </div>
      <button onClick={saveCandidate}>+</button>
      <button onClick={showNextCandidate}>-</button>
    </div>
  );
};

export default CandidateSearch;
