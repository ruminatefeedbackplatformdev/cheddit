import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Reply from '../components/Reply';

describe('Reply component', () => {
  it('displays reply button', () => {
    const { container } = render(
      <BrowserRouter>
        <Reply enabled setEnabled={jest.fn()} />
      </BrowserRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
