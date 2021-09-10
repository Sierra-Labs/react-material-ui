import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Paper, IconButton, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useDebounce } from '../hooks/Debounce.hooks';

const StyledSearchBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 20px;
  .search {
    flex: 1;
    display: flex;
    padding: 5px;
    max-width: 512px;
    .MuiInputBase-root {
      width: 100%;
    }
  }
`;

export interface SearchBoxProps {
  value?: string | null;
  onSearch?: (event: any) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  children,
  onSearch
}) => {
  // Create a ref that store the onSearch handler
  const searchHandler = useRef<(event: any) => void>();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    searchHandler.current = onSearch;
  }, [onSearch]);

  const [forceSearch, setForceSearch] = useState(false);
  const [search, setSearch] = useState(value);
  const debouncedSearch = useDebounce(search ? search : '', 300);
  useEffect(() => {
    if ((forceSearch || debouncedSearch) && searchHandler.current) {
      searchHandler.current(debouncedSearch);
    }
  }, [debouncedSearch, forceSearch]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  return (
    <StyledSearchBox className='search-box'>
      <Paper className='search'>
        <IconButton aria-label='search' size='small'>
          <SearchIcon />
        </IconButton>
        <InputBase
          id='search-textfield'
          placeholder='Search'
          type='search'
          value={search || ''}
          onChange={handleSearch}
          onKeyPress={(event: any) =>
            event.key === 'Enter' && setForceSearch(true)
          }
        />
      </Paper>
      {children}
    </StyledSearchBox>
  );
};

export default SearchBox;
