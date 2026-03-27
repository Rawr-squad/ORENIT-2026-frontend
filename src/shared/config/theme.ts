import type { ThemeConfig } from 'antd';

export const palette = {
	primary: '#F8FFA1',
	primaryHover: '#F4F07A',
	primaryActive: '#E7E45C',
	pink: '#F6D8EE',
	purple: '#A8A3F6',
	navy: '#243168',
	bgBase: '#FFFDF5',
	bgContainer: '#FFFFFF',
	text: '#243168',
	textSecondary: '#7B84A5',
	borderSoft: '#F6D8EE',
	borderAlt: '#E5E0FF',
};

export const antdTheme: ThemeConfig = {
	token: {
		colorPrimary: palette.primary,
		colorInfo: palette.purple,
		colorSuccess: '#7AC77A',
		colorError: '#F97373',
		colorWarning: '#F6D8AA',
		colorBgBase: palette.bgBase,
		colorBgContainer: palette.bgContainer,
		colorBorder: palette.borderAlt,
		colorText: palette.text,
		colorTextSecondary: palette.textSecondary,
		borderRadius: 14,
		fontSize: 16,
		fontFamily: "'Nunito', 'Segoe UI', sans-serif",
	},
	components: {
		Button: {
			borderRadius: 999,
			controlHeight: 44,
			colorPrimary: palette.primary,
			colorPrimaryHover: palette.primaryHover,
			colorPrimaryActive: palette.primaryActive,
			colorText: palette.navy,
		},
		Card: {
			borderRadiusLG: 18,
			paddingLG: 20,
			colorBorderSecondary: palette.pink,
		},
		Input: {
			borderRadius: 12,
			controlHeight: 44,
			activeBorderColor: palette.purple,
			hoverBorderColor: palette.purple,
		},
		Layout: {
			headerBg: palette.bgContainer,
			siderBg: palette.bgContainer,
			bodyBg: palette.bgBase,
		},
		Menu: {
			itemBorderRadius: 10,
			itemBg: 'transparent',
			itemSelectedBg: palette.pink,
			itemSelectedColor: palette.navy,
			itemHoverBg: '#FFF7C7',
		},
		Tag: {
			borderRadiusSM: 999,
			defaultBg: palette.pink,
			defaultColor: palette.navy,
		},
		Progress: {
			defaultColor: palette.purple,
			remainingColor: palette.pink,
		},
		Table: {
			headerBg: '#FFF9E8',
			headerColor: palette.navy,
			rowHoverBg: '#FFFDF5',
		},
	},
};

