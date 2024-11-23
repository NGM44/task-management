import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDebounce } from '../hooks/debounce';
import { SearchBar } from '../components/Searchbar';


jest.mock('../hooks/debounce', () => ({
  useDebounce: (value: string) => value,
}));

describe('SearchBar', () => {

  let onSearchMock: jest.Mock;

  beforeEach(() => {
    onSearchMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
 
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    expect(searchInput).toBeInTheDocument();
    
  
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<SearchBar onSearch={onSearchMock} className={customClass} />);
    
    const container = screen.getByRole('textbox').closest('div');
    expect(container?.parentElement).toHaveClass(customClass);
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(searchInput.value).toBe('test query');
  });

  it('calls onSearch when input changes', () => {
    jest.useFakeTimers();
    
    render(<SearchBar onSearch={onSearchMock} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    

    jest.runAllTimers();
    
    expect(onSearchMock).toHaveBeenCalledWith('test query');
    
    jest.useRealTimers();
  });

  it('shows clear button only when there is input', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
 
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    
 
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...') as HTMLInputElement;
    

    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput.value).toBe('test query');
    

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    

    expect(searchInput.value).toBe('');
    expect(onSearchMock).toHaveBeenCalledWith('');
  });
});