import React from 'react';
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

const Sidebarnav = () => {
	return(
		<Sidebar.Pushable>
			<Sidebar
			as={Menu}
			animation='overlay'
			icon='labeled'
			inverted
			vertical
			visible
			width='thin'
			>
				<Menu.Item as='a'>
				<Icon name='home' />
				Home
				</Menu.Item>
				<Menu.Item as='a'>
				<Icon name='gamepad' />
				Games
				</Menu.Item>
				<Menu.Item as='a'>
				<Icon name='camera' />
				Channels
				</Menu.Item>
			</Sidebar>
			<Sidebar.Pusher>
				<Segment basic>
				<Header as='h3'>Application Content</Header>
				<Image src='' />
				</Segment>
			</Sidebar.Pusher>
		</Sidebar.Pushable>  
	)
}

export default Sidebarnav;