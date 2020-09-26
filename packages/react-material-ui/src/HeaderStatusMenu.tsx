import React from 'react';
import { Typography, Link, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  display: inline-flex;
  padding: 5px 7px;
  margin: 0 -7px;
  &:hover {
    text-decoration: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.25);
  }
  .label {
    font-weight: 500;
    &.placeholder {
      opacity: 0.75;
    }
  }
  .icon {
    display: flex;
    align-items: center;
  }
`;

export interface HeaderStatusMenuOptions {
  value: string;
  label: string;
}

export interface HeaderStatusMenuProps {
  value?: string;
  placeholder?: string;
  options: (HeaderStatusMenuOptions | string)[];
  onChange?: (status: HeaderStatusMenuOptions | string) => void;
}

const HeaderStatusMenu: React.FC<HeaderStatusMenuProps> = props => {
  const { value, placeholder, options, onChange } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option: HeaderStatusMenuOptions | string) => {
    setAnchorEl(null);
    if (onChange) onChange(option);
  };

  const selectedOption = options.find(option =>
    typeof option === 'string' ? option === value : option.value === value
  );
  const label =
    typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption
      ? selectedOption.label
      : '';

  return (
    <Typography variant='h4'>
      <StyledLink
        href=''
        display='block'
        color='inherit'
        aria-controls='header-status-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <div className={`label ${value ? 'value' : 'placeholder'}`}>
          {/* &nbsp; to create none breaking spaces and ArrowDropDownIcon has
        a -24px margin-left to fill the &nbsp; spacing to attach to last
        word in label. */}
          {label || placeholder}
        </div>
        <div className='icon'>
          <ArrowDropDownIcon />
        </div>
      </StyledLink>
      <Menu
        MenuListProps={{
          style: { minWidth: anchorEl?.clientWidth }
        }}
        id='header-status-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {options.map(option =>
          typeof option === 'string' ? (
            <MenuItem key={option} onClick={() => handleSelect(option)}>
              {option}
            </MenuItem>
          ) : (
            <MenuItem key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </MenuItem>
          )
        )}
      </Menu>
    </Typography>
  );
};

export default HeaderStatusMenu;
