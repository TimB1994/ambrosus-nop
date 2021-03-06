/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Crypto from './services/crypto';
import Store from './services/store';
import System from './services/system';
import Validations from './services/validations';
import SetupCreator from './services/setup_creator';

import {HeadWrapper, KycWhitelistWrapper, RolesWrapper, PayoutsWrapper, TimeWrapper, PayoutsActions, OnboardActions, AtlasStakeStoreWrapper, constants} from 'ambrosus-node-contracts';

import StateModel from './models/state_model';
import SystemModel from './models/system_model';
import SmartContractsModel from './models/smart_contracts_model';
import AtlasModeModel from './models/atlas_mode_model';

import checkDockerAvailablePhase from './phases/check_docker_available_phase';
import getPrivateKeyPhase from './phases/get_private_key_phase';
import checkAddressWhitelistingStatusPhase from './phases/check_address_whitelisting_status_phase';
import selectNodeTypePhase from './phases/select_node_type_phase';
import getNodeUrlPhase from './phases/get_node_url_phase';
import getNodeIPPhase from './phases/get_node_ip_phase';
import getUserEmailPhase from './phases/get_user_email_phase';
import manualSubmissionPhase from './phases/manual_submission_phase';
import performOnboardingPhase from './phases/perform_onboarding_phase';
import selectNetworkPhase from './phases/select_network_phase';
import prepareDockerPhase from './phases/prepare_docker_phase';
import selectActionPhase from './phases/select_action_phase';

import askForPrivateKeyDialog from './dialogs/ask_for_private_key_dialog';
import dockerDetectedDialog from './dialogs/docker_detected_dialog';
import dockerMissingDialog from './dialogs/docker_missing_dialog';
import privateKeyDetectedDialog from './dialogs/private_key_detected_dialog';
import askForNodeTypeDialog from './dialogs/ask_for_node_type_dialog';
import askForNodeUrlDialog from './dialogs/ask_for_node_url_dialog';
import askForNodeIPDialog from './dialogs/ask_for_node_ip_dialog';
import roleSelectedDialog from './dialogs/role_selected_dialog';
import nodeUrlDetectedDialog from './dialogs/node_url_detected_dialog';
import nodeIPDetectedDialog from './dialogs/node_ip_detected_dialog';
import askForUserEmailDialog from './dialogs/ask_for_user_email_dialog';
import userEmailDetectedDialog from './dialogs/user_email_detected_dialog';
import displaySubmissionDialog from './dialogs/display_submission_dialog';
import addressIsNotWhitelistedDialog from './dialogs/address_is_not_whitelisted_dialog';
import addressIsWhitelistedDialog from './dialogs/address_is_whitelisted_dialog';
import notEnoughBalanceDialog from './dialogs/not_enough_balance_dialog';
import onboardingConfirmationDialog from './dialogs/onboarding_confirmation_dialog';
import onboardingSuccessfulDialog from './dialogs/onboarding_successful_dialog';
import alreadyOnboardedDialog from './dialogs/already_onboarded_dialog';
import askForNetworkDialog from './dialogs/ask_for_network_dialog';
import networkSelectedDialog from './dialogs/network_selected_dialog';
import healthCheckUrlDialog from './dialogs/healthcheck_url_dialog';
import dockerComposeCommandDialog from './dialogs/docker_compose_command_dialog';
import insufficientFundsDialog from './dialogs/insufficient_funds_dialog';
import genericErrorDialog from './dialogs/generic_error_dialog';
import logoDialog from './dialogs/logo_dialog';
import selectActionDialog from './dialogs/select_action_dialog';
import changeUrlConfirmationDialog from './dialogs/change_url_confirmation_dialog';
import changeUrlSuccessfulDialog from './dialogs/change_url_successful_dialog';
import availablePayoutDialog from './dialogs/available_payouts_dialog';
import confirmPayoutWithdrawalDialog from './dialogs/confirm_payout_withdraw_dialog';
import withdrawalSuccessfulDialog from './dialogs/withdrawal_successful_dialog';
import dockerRestartRequiredDialog from './dialogs/docker_restart_required_dialog';
import retirementSuccessfulDialog from './dialogs/retirement_successful_dialog';
import confirmRetirementDialog from './dialogs/confirm_retirement_dialog';
import askForApolloDepositDialog from './dialogs/ask_for_apollo_deposit_dialog';
import nectarWarningDialog from './dialogs/nectar_warning_dialog';
import askForApolloMinimalDepositDialog from './dialogs/ask_for_apollo_minimal_deposit_dialog';
import continueAtlasRetirementDialog from './dialogs/continue_atlas_retirement_dialog';
import retirementStartSuccessfulDialog from './dialogs/retirement_start_successful_dialog';
import retirementContinueDialog from './dialogs/retirement_continue_dialog';
import retirementStopDialog from './dialogs/retirement_stop_dialog';

import prepareAction from './menu_actions/prepare_action';
import payoutAction from './menu_actions/payout_action';
import changeUrlAction from './menu_actions/change_url_action';
import retireAction from './menu_actions/retire_action';
import quitAction from './menu_actions/quit_action';

import execCmd from './utils/execCmd';
import HttpUtils from './utils/http_utils';
import messages from './messages';
import networks from '../config/networks';
import Web3 from 'web3';
import acceptTosPhase from './phases/accept_tos_phase';
import acceptTosDialog from './dialogs/accept_tos_dialog';

class Builder {
  static buildStage1(config) {
    const objects = {};

    objects.web3 = new Web3();

    objects.httpUtils = new HttpUtils();

    objects.store = new Store(config.storePath);
    objects.system = new System(execCmd);
    objects.validations = new Validations();
    objects.crypto = new Crypto(objects.web3);
    objects.setupCreator = new SetupCreator(config.templateDirectory, config.outputDirectory);

    objects.systemModel = new SystemModel(objects.system);
    objects.stateModel = new StateModel(objects.store, objects.crypto, objects.setupCreator);

    objects.privateKeyDetectedDialog = privateKeyDetectedDialog(messages);
    objects.askForPrivateKeyDialog = askForPrivateKeyDialog(objects.validations, messages);
    objects.dockerDetectedDialog = dockerDetectedDialog(messages);
    objects.dockerMissingDialog = dockerMissingDialog(messages);
    objects.askForNodeTypeDialog = askForNodeTypeDialog(messages);
    objects.roleSelectedDialog = roleSelectedDialog(messages);
    objects.askForNodeUrlDialog = askForNodeUrlDialog(objects.validations, messages);
    objects.askForNodeIPDialog = askForNodeIPDialog(objects.validations, messages);
    objects.nodeUrlDetectedDialog = nodeUrlDetectedDialog(messages);
    objects.nodeIPDetectedDialog = nodeIPDetectedDialog(messages);
    objects.askForUserEmailDialog = askForUserEmailDialog(objects.validations, messages);
    objects.userEmailDetectedDialog = userEmailDetectedDialog(messages);
    objects.displaySubmissionDialog = displaySubmissionDialog(messages);
    objects.addressIsNotWhitelistedDialog = addressIsNotWhitelistedDialog(messages);
    objects.addressIsWhitelistedDialog = addressIsWhitelistedDialog(messages);
    objects.notEnoughBalanceDialog = notEnoughBalanceDialog(messages);
    objects.onboardingConfirmationDialog = onboardingConfirmationDialog(messages);
    objects.onboardingSuccessfulDialog = onboardingSuccessfulDialog(messages);
    objects.alreadyOnboardedDialog = alreadyOnboardedDialog(messages);
    objects.askForNetworkDialog = askForNetworkDialog(messages);
    objects.networkSelectedDialog = networkSelectedDialog(messages);
    objects.healthCheckUrlDialog = healthCheckUrlDialog(messages);
    objects.dockerComposeCommandDialog = dockerComposeCommandDialog(messages, config.outputDirectory);
    objects.insufficientFundsDialog = insufficientFundsDialog(messages);
    objects.genericErrorDialog = genericErrorDialog(messages);
    objects.selectActionDialog = selectActionDialog(messages);
    objects.logoDialog = logoDialog;
    objects.changeUrlConfirmationDialog = changeUrlConfirmationDialog(messages);
    objects.changeUrlSuccessfulDialog = changeUrlSuccessfulDialog(messages);
    objects.nectarWarningDialog = nectarWarningDialog(messages);
    objects.availablePayoutDialog = availablePayoutDialog(messages);
    objects.confirmPayoutWithdrawalDialog = confirmPayoutWithdrawalDialog(messages);
    objects.withdrawalSuccessfulDialog = withdrawalSuccessfulDialog(messages);
    objects.dockerRestartRequiredDialog = dockerRestartRequiredDialog(messages);
    objects.confirmRetirementDialog = confirmRetirementDialog(messages);
    objects.retirementSuccessfulDialog = retirementSuccessfulDialog(messages, config.outputDirectory);
    objects.askForApolloDepositDialog = askForApolloDepositDialog(objects.validations, messages);
    objects.askForApolloMinimalDepositDialog = askForApolloMinimalDepositDialog(objects.validations, messages);
    objects.acceptTosDialog = acceptTosDialog(objects.validations, messages);
    objects.continueAtlasRetirementDialog = continueAtlasRetirementDialog(messages);
    objects.retirementStartSuccessfulDialog = retirementStartSuccessfulDialog(messages);
    objects.retirementContinueDialog = retirementContinueDialog(messages);
    objects.retirementStopDialog = retirementStopDialog(messages);

    objects.selectNetworkPhase = selectNetworkPhase(networks, objects.stateModel, objects.askForNetworkDialog, objects.networkSelectedDialog, objects.dockerRestartRequiredDialog);
    objects.checkDockerAvailablePhase = checkDockerAvailablePhase(objects.systemModel, objects.dockerDetectedDialog, objects.dockerMissingDialog);
    objects.getPrivateKeyPhase = getPrivateKeyPhase(objects.stateModel, objects.crypto, objects.privateKeyDetectedDialog, objects.askForPrivateKeyDialog);

    return objects;
  }

  static buildStage2(stage1Objects, network, privateKey) {
    const objects = {...stage1Objects};

    objects.web3 = new Web3(network.rpc);
    const account = objects.web3.eth.accounts.privateKeyToAccount(privateKey);
    objects.web3.eth.accounts.wallet.add(account);
    const {address} = account;
    objects.web3.eth.defaultAccount = address;

    objects.headWrapper = new HeadWrapper(network.headContractAddress, objects.web3, address);
    objects.kycWhitelistWrapper = new KycWhitelistWrapper(objects.headWrapper, objects.web3, address);
    objects.rolesWrapper = new RolesWrapper(objects.headWrapper, objects.web3, address);
    objects.timeWrapper = new TimeWrapper(objects.headWrapper, objects.web3, address);
    objects.payoutsWrapper = new PayoutsWrapper(objects.headWrapper, objects.web3, address);
    objects.atlasStakeWrapper = new AtlasStakeStoreWrapper(objects.headWrapper, objects.web3, address);
    objects.payoutsActions = new PayoutsActions(objects.timeWrapper, objects.payoutsWrapper);
    objects.onboardActions = new OnboardActions(objects.kycWhitelistWrapper, objects.rolesWrapper, objects.atlasStakeWrapper);

    objects.crypto = new Crypto(objects.web3);

    objects.stateModel = new StateModel(objects.store, objects.crypto, objects.setupCreator);
    objects.smartContractsModel = new SmartContractsModel(objects.crypto, objects.kycWhitelistWrapper, objects.rolesWrapper);
    objects.atlasModeModel = new AtlasModeModel(objects.httpUtils, account, objects.stateModel);

    objects.selectNodeTypePhase = selectNodeTypePhase(objects.stateModel, objects.askForNodeTypeDialog, objects.askForApolloMinimalDepositDialog, objects.roleSelectedDialog);
    objects.getNodeUrlPhase = getNodeUrlPhase(objects.stateModel, objects.nodeUrlDetectedDialog, objects.askForNodeUrlDialog);
    objects.getNodeIPPhase = getNodeIPPhase(objects.stateModel, objects.nodeIPDetectedDialog, objects.askForNodeIPDialog);
    objects.getUserEmailPhase = getUserEmailPhase(objects.stateModel, objects.userEmailDetectedDialog, objects.askForUserEmailDialog);
    objects.manualSubmissionPhase = manualSubmissionPhase(objects.stateModel, objects.displaySubmissionDialog);
    objects.checkAddressWhitelistingStatusPhase = checkAddressWhitelistingStatusPhase(objects.smartContractsModel, objects.stateModel, objects.addressIsNotWhitelistedDialog, objects.addressIsWhitelistedDialog);
    objects.performOnboardingPhase = performOnboardingPhase(objects.stateModel, objects.smartContractsModel,
      objects.notEnoughBalanceDialog, objects.alreadyOnboardedDialog, objects.askForApolloDepositDialog, objects.onboardingConfirmationDialog,
      objects.onboardingSuccessfulDialog, objects.insufficientFundsDialog, objects.genericErrorDialog);
    objects.prepareDockerPhase = prepareDockerPhase(objects.stateModel, objects.healthCheckUrlDialog, objects.dockerComposeCommandDialog);
    objects.acceptTosPhase = acceptTosPhase(objects.stateModel, objects.smartContractsModel, objects.acceptTosDialog);

    objects.actions = {
      [messages.actions.changeUrl]: prepareAction(changeUrlAction(
        objects.stateModel,
        objects.rolesWrapper,
        objects.nectarWarningDialog,
        objects.askForNodeUrlDialog,
        objects.changeUrlConfirmationDialog,
        objects.changeUrlSuccessfulDialog),
      [constants.ATLAS, constants.HERMES]
      ),
      [messages.actions.payouts]: prepareAction(payoutAction(
        objects.payoutsActions,
        objects.availablePayoutDialog,
        objects.confirmPayoutWithdrawalDialog,
        objects.withdrawalSuccessfulDialog),
      [constants.ATLAS]
      ),
      [messages.actions.retire]: prepareAction(retireAction(
        objects.atlasModeModel,
        objects.onboardActions,
        objects.confirmRetirementDialog,
        objects.retirementSuccessfulDialog,
        objects.continueAtlasRetirementDialog,
        objects.retirementStartSuccessfulDialog,
        objects.retirementContinueDialog,
        objects.retirementStopDialog,
        objects.genericErrorDialog
      )),
      [messages.actions.quit]: prepareAction(quitAction())
    };

    objects.selectActionPhase = selectActionPhase(
      objects.actions,
      objects.selectActionDialog,
      objects.insufficientFundsDialog,
      objects.genericErrorDialog
    );

    return objects;
  }
}

export default Builder;
