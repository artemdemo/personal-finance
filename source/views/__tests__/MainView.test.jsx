import React from 'react';
import renderer from 'react-test-renderer';
import MainView from '../components/MainView';

jest.mock('../../components/Icon/Icon');

describe('<MainView>', () => {
    it('Simple render', () => {
        const tree = renderer.create(
            <MainView user={{}} />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});